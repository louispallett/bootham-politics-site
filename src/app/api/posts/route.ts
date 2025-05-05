import { NextResponse } from "next/server";
import Post from "@/models/Post";
import { connectToDB } from "@/lib/db";

export async function GET() {
    try {
        await connectToDB();
        const posts = await Post.find();
        return NextResponse.json(posts);
    } catch (err: any) {
        console.error("Error fetching posts: ", err);

        return NextResponse.json(
            {
                success: false,
                message: err.message || "Server Error"
            },
            { status: err.statusCode || 500}
        );
    }
}

export async function POST(req: Request) {
    try {
        await connectToDB();
        const data = await req.json();
        const newPost = await Post.create(data);

        return NextResponse.json(newPost, { status: 201 });
    } catch (err: any) {
        console.error("Error creating post: ", err);

        return NextResponse.json(
            {
                success: false,
                message: err.message || "Server Error"
            },
            { status: err.statusCode || 500}
        );
    }
}