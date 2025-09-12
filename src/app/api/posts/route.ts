import { NextResponse } from "next/server";
import Post from "@/models/Post";
import { connectToDB } from "@/lib/db";
import { z } from "zod";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import Tag from "@/models/Tag";

export async function GET() {
    try {
        await connectToDB();
        const posts = await Post.find().populate(
            { 
                path: "author", 
                select: "firstName lastName -_id",
                model: User
            })
        .populate(
            { 
                path: "tags",
                select: "name -_id",
                model: Tag
            });

        return NextResponse.json(posts);
    } catch (err:any) {
        console.error(err);
        return NextResponse.json(
            { success: false, message: err.message || "Internal Server Error" },
            { status: err.statusCode || 500 }
        );
    }   
}

const ValidationSchema = z.object({
    title: z.string().trim().max(200),
    synopsis: z.string().trim().max(1000),
    content: z.string().min(8).max(100000),
    tags: z.array(z.string().regex(/^[a-f\d]{24}$/i, "Invalid tag ID")).optional()
});

export async function POST(req: Request) {
    try {
        await connectToDB();
    
        const cookieStore = cookies();
        const token = (await cookieStore).get("token")?.value;
    
        if (!token) {
            return NextResponse.json( { message: "Unauthorized: No token provided" }, { status: 401 });
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
            return NextResponse.json( { message: "Unauthorized: No token provided" }, { status: 401 });
        }

        const body = await req.json();

        const parsed = ValidationSchema.safeParse(body);

        if(!parsed.success) {
            console.error(parsed.error.flatten().fieldErrors);
            return NextResponse.json({
                message: "Validation Errors",
                errors: parsed.error.flatten().fieldErrors,
            }, { status: 400 });
        }

        const { title, synopsis, content, tags } = parsed.data;

        const newPost = await Post.create({ title, synopsis, content, author: userId, tags });

        return NextResponse.json(newPost, { status: 201 });
    } catch (err:any) {
        console.error(err);
        return NextResponse.json(
            { success: false, message: err.message || "Internal Server Error" },
            { status: err.statusCode || 500 }
        );
    }   
}