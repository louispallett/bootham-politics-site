import { NextResponse } from "next/server";
import Post from "@/models/Post";
import { connectToDB } from "@/lib/db";
import { z } from "zod";

const ValidationSchema1 = z.object({
    title: z.string().trim().max(200),
    content: z.string().min(8).max(100000)
});

export async function GET() {
    try {
        await connectToDB();
        const posts = await Post.find();
        return NextResponse.json(posts);
    } catch (err:any) {
        console.error(err);
        return NextResponse.json(
            { success: false, message: err.message || "Internal Server Error" },
            { status: err.statusCode || 500 }
        );
    }   
}

export async function POST(req: Request) {
    try {
        await connectToDB();
        const body = await req.json();

        const parsed = ValidationSchema1.safeParse(body);
        if(!parsed.success) {
            console.error(parsed.error.flatten().fieldErrors);
            return NextResponse.json({
                message: "Validation Errors",
                errors: parsed.error.flatten().fieldErrors,
            }, { status: 400 });
        }

        const { title, content } = parsed.data;

        const newPost = await Post.create({ title, content });

        return NextResponse.json(newPost, { status: 201 });
    } catch (err:any) {
        console.error(err);
        return NextResponse.json(
            { success: false, message: err.message || "Internal Server Error" },
            { status: err.statusCode || 500 }
        );
    }   
}

const ValidationSchema2 = z.object({
    _id: z.string().trim().max(36),
    title: z.string().trim().max(200),
    content: z.string().min(8).max(100000)
});

export async function PUT(req: Request) {
    try {
        await connectToDB();

        const body = await req.json();

        const parsed = ValidationSchema2.safeParse(body);
        if(!parsed.success) {
            console.error(parsed.error.flatten().fieldErrors);
            return NextResponse.json({
                message: "Validation Errors",
                errors: parsed.error.flatten().fieldErrors,
            }, { status: 400 });
        }

        const { _id, title, content } = parsed.data;

        await Post.updateOne(
            { _id  },
            { title, content }
        );

        return new NextResponse(null, { status: 204 });
    } catch (err:any) {
        console.error(err);
        return NextResponse.json(
            { success: false, message: err.message || "Internal Server Error" },
            { status: err.statusCode || 500 }
        );
    }   
}