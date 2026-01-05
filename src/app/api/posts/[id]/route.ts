import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import Post from "@/models/Post";
import { connectToDB } from "@/lib/db";
import { z } from "zod";
import mongoose from "mongoose";
import HttpError from "@/lib/HttpError";
import { s3Client } from "@/lib/s3";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getDocumentsByPostId } from "@/lib/documents";
import { DocumentType } from "@/lib/types";
import Document from "@/models/Document";

export async function GET(
  req: NextRequest | Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectToDB();

    const { id } = await params;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
    }

    const _id = new ObjectId(id);

    const post = await Post.findById(_id);
    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: err.message || "Internal Server Error" },
      { status: err.statusCode || 500 },
    );
  }
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const PutValidation = z.object({
  title: z.string().trim().max(200),
  synopsis: z.string().trim().max(1000),
  content: z.string().min(8).max(100000),
  tags: z
    .array(z.string().regex(/^[a-f\d]{24}$/i, "Invalid tag ID"))
    .optional(),
  banner: z.instanceof(File).optional(),
  bannerCaption: z.string().max(1000).optional(),
});

export async function PUT(
  req: NextRequest | Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectToDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { success: false, message: "Invalid post ID" },
        { status: 400 },
      );
    }

    const formData = await req.formData();
    const body = Object.fromEntries(formData.entries());

    const parsed = PutValidation.safeParse({
      title: body.title,
      synopsis: body.synopsis,
      content: body.content,
      tags: body.tags ? JSON.parse(body.tags.toString()) : undefined,
      banner: body.banner,
      bannerCaption: body.bannerCaption,
    });

    if (!parsed.success) {
      console.error(parsed.error.flatten().fieldErrors);
      return NextResponse.json(
        {
          message: "Validation Errors",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    const { title, synopsis, content, tags, banner, bannerCaption } =
      parsed.data;

    // Cloudinary
    let cloudinaryURL = null;
    let cloudinaryId = null;
    if (banner) {
      const originalPost = await Post.findById(id);
      if (originalPost.bannerURL) {
        await cloudinary.uploader.destroy(originalPost.cloudinaryId);
      }

      // Add new image to cloudinary
      const arrayBuffer = await banner.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            { resource_type: "auto", folder: "Bootham Banners" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            },
          )
          .end(buffer);
      });

      cloudinaryURL = (result as any).secure_url;
      cloudinaryId = (result as any).public_id;
    }

    await Post.updateOne({ _id: id }, [
      {
        $set: {
          title,
          synopsis,
          content,
          tags,
          bannerURL: {
            $cond: {
              if: { $ne: [cloudinaryURL, null] },
              then: cloudinaryURL,
              else: "$bannerURL",
            },
          },
          cloudinaryId: {
            $cond: {
              if: { $ne: [cloudinaryId, null] },
              then: cloudinaryId,
              else: "$cloudinaryId",
            },
          },
          bannerCaption,
        },
      },
    ]);

    return new NextResponse(null, { status: 204 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: err.message || "Internal Server Error" },
      { status: err.statusCode || 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest | Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectToDB();

    const { id } = await params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new HttpError("Invalid post ID", 400);
    }

    // Delete documents (if any)
    const documents = await getDocumentsByPostId(id);
    if (!documents) {
      throw new HttpError("Database failed to connect");
    }

    while (documents.length > 0) {
      try {
        const workingDocument: DocumentType | undefined = documents.pop();

        await s3Client.send(
          new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME!,
            Key: workingDocument?.s3Key,
          }),
        );

        await Document.findOneAndDelete({ _id: workingDocument?._id });
      } catch (err: any) {
        throw new HttpError("Error when deleting documents. Details: " + err);
      }
    }

    // Delete Cloudinary image
    const post = await Post.findById(id);
    if (post.bannerURL) {
      await cloudinary.uploader.destroy(post.cloudinaryId);
    }

    // Delete post
    await post.deleteOne();

    return new NextResponse(null, { status: 204 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: err.message || "Internal Server Error" },
      { status: err.statusCode || 500 },
    );
  }
}
