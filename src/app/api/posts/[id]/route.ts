import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import Post from "@/models/Post";
import { connectToDB } from "@/lib/db";
import { z } from "zod";
import mongoose from "mongoose";
import HttpError from "@/lib/HttpError";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectToDB();

    const id = await params.id;

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
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectToDB();

    const id = await params.id;

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
      // Delete original image on cloudinary database
      // FIXME: This isn't working because we need to use the cloudinaryID, which we currently aren't saving. Either, we need to save this to our
      // post model, and save it when we upload the picture, or we need to find out if we can delete via the URL.
      // FIXME: Additionally, if the user doesn't send a banner, it automatically updates banner to null!
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

const DeleteValidation = z.object({
  postId: z
    .string()
    .trim()
    .refine((v) => mongoose.Types.ObjectId.isValid(v), {
      message: "Invalid tag ID",
    }),
});

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } },
) {
  try {
    await connectToDB();

    const postIdSchema = DeleteValidation.shape.postId;
    const parsed = postIdSchema.safeParse(params.id);

    if (!parsed.success) {
      console.error("posts/[id]/DELETE: " + parsed.error.message);
      throw new HttpError(parsed.error.message, 400);
    }

    const postId = parsed.data;

    await Post.findByIdAndDelete(postId);

    return new NextResponse(null, { status: 204 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: err.message || "Internal Server Error" },
      { status: err.statusCode || 500 },
    );
  }
}
