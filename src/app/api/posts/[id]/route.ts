import { NextRequest, NextResponse } from "next/server";
import Post from "@/models/Post";
import { connectToDB } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectToDB();
        const post = await Post.findById(params.id);
        if (!post) {
            return NextResponse.json({ message: "Post not found" }, { status: 404 });
        }

        return NextResponse.json(post);
    } catch (err:any) {
        console.error(err);
        return NextResponse.json(
            { success: false, message: err.message || "Internal Server Error" },
            { status: err.statusCode || 500 }
        );
    }
}