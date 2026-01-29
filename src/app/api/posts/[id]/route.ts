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
import {
  ALLOWED_BANNER_MIME_TYPES,
  ALLOWED_FORMATS,
  MAX_FILE_SIZE,
  PostValidationSchema,
} from "../auxiliary";
import { fileTypeFromBuffer } from "file-type";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
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

    const parsed = PostValidationSchema.safeParse({
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
      // VALIDATION CHECKS ON BANNER
      // Check file size
      if (banner.size > MAX_FILE_SIZE) {
        throw new HttpError("Banner image exceeds 15MB", 400);
      }

      // Check File Type
      // NOTE: package file-type helps prevent renamed executables (i.e. virus.jpg.exe)
      const buffer = Buffer.from(await banner.arrayBuffer());
      const detectedType = await fileTypeFromBuffer(buffer);
      if (
        !detectedType ||
        !ALLOWED_BANNER_MIME_TYPES.includes(detectedType.mime)
      ) {
        throw new HttpError("Banner file type not allowed", 400);
      }
      const originalPost = await Post.findById(id);
      if (originalPost.bannerURL) {
        await cloudinary.uploader.destroy(originalPost.cloudinaryId);
      }

      // Add new image to cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "image",
              folder: "Bootham Banners",
              max_file_size: MAX_FILE_SIZE,
              allowed_formats: ALLOWED_FORMATS,
            },
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
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
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
