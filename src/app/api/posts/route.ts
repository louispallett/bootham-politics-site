import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import Post from "@/models/Post";
import { connectToDB } from "@/lib/db";
import { z } from "zod";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import Tag from "@/models/Tag";

// const config = { api: { bodyParser: { sizeLimit: "5mb" } } };

export async function GET() {
  try {
    await connectToDB();
    const posts = await Post.find()
      .populate({
        path: "author",
        select: "firstName lastName -_id",
        model: User,
      })
      .populate({
        path: "tags",
        select: "name -_id",
        model: Tag,
      });

    return NextResponse.json(posts);
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

const ValidationSchema = z.object({
  title: z.string().trim().max(200),
  synopsis: z.string().trim().max(1000),
  content: z.string().min(8).max(100000),
  tags: z
    .array(z.string().regex(/^[a-f\d]{24}$/i, "Invalid tag ID"))
    .optional(),
  banner: z.instanceof(File).optional(),
  bannerCaption: z.string().max(1000).optional(),
});

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Unauthorized: No token provided" },
        { status: 401 },
      );
    }

    let userId: string | null = null;

    try {
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
      userId = decoded?.userId;

      if (!userId) {
        throw new Error("Invalid token payload");
      }
    } catch (err) {
      console.error("JWT Verification failure: ", err);
      return NextResponse.json(
        { message: "Unauthorized: No token provided" },
        { status: 401 },
      );
    }

    // Parse form data
    const formData = await req.formData();
    const body = Object.fromEntries(formData.entries());

    // Validate non-file fields
    const parsed = ValidationSchema.safeParse({
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

    const newPost = await Post.create({
      title,
      synopsis,
      content,
      author: userId,
      tags,
      bannerURL: cloudinaryURL,
      cloudinaryId,
      bannerCaption,
    });

    return NextResponse.json(newPost, { status: 201 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: err.message || "Internal Server Error" },
      { status: err.statusCode || 500 },
    );
  }
}
