import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import Post from "@/models/Post";
import { connectToDB } from "@/lib/db";
import { z } from "zod";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import Tag from "@/models/Tag";
import HttpError from "@/lib/HttpError";
import { fileTypeFromBuffer } from "file-type";

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

const MAX_FILE_SIZE = 15 * 1024 * 1024;

const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/tif",
  "image/png",
  "image/webp",
  "image/gif",
];

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ValidationSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, { message: "Title: Required" })
    .max(200, { message: "Title: Max length 200 characters" }),
  synopsis: z
    .string()
    .trim()
    .min(1, { message: "Synopsis: Required" })
    .max(1000, { message: "Synopsis: Max characters 1000" }),
  content: z
    .string()
    .min(7, { message: "Content: Required" })
    .max(100000, { message: "Content: Max 100000 characters" }),
  tags: z
    .array(z.string().regex(/^[a-f\d]{24}$/i, "Invalid tag ID"))
    .optional(),
  banner: z
    .instanceof(File)
    .refine((file) => file.size <= MAX_FILE_SIZE, {
      message: "Banner must be smaller than 15MB",
    })
    .refine(
      (file) =>
        ALLOWED_MIME_TYPES.includes(
          file.type,
        ),
      {
        message: "Invalid banner image type",
      },
    )
    .optional(),
  bannerCaption: z
    .string()
    .max(1000, { message: "Banner Caption: Max 1000 characters" })
    .optional(),
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
      const decoded = jwt.verify(token, process.env.JWT_SECRET!, {
        algorithms: ["HS256"],
      }) as { userId: string };
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

    // Cloudinary banner uploader
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
      if (!detectedType || !ALLOWED_MIME_TYPES.includes(detectedType.mime)) {
        throw new HttpError("Banner file type not allowed", 400);
      }

      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "image",
              folder: "Bootham Banners",
              max_file_size: MAX_FILE_SIZE,
              allowed_formats: ALLOWED_MIME_TYPES,
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
