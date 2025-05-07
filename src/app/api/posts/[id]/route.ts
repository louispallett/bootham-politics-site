import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import Post from "@/models/Post";
import { connectToDB } from "@/lib/db";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await connectToDB();

        const id = params.id;

        if (!ObjectId.isValid(id)) {
          return NextResponse.json({ error: "Invalid ID format" }, { status: 400 });
        }
      
        const _id = new ObjectId(id);

        const post = await Post.findById(_id);
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