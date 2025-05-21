import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import Post from "@/models/Post";
import { connectToDB } from "@/lib/db";
import { z } from "zod";
import mongoose from "mongoose";
import HttpError from "@/lib/HttpError";

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

const PutValidation = z.object({
    title: z.string().trim().max(200),
    content: z.string().min(8).max(100000),
    published: z.boolean()
});

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectToDB();

        const body = await req.json();

        const parsed = PutValidation.safeParse(body);

        if(!parsed.success) {
            console.error(parsed.error.flatten().fieldErrors);
            return NextResponse.json({
                message: "Validation Errors",
                errors: parsed.error.flatten().fieldErrors,
            }, { status: 400 });
        }

        const { title, content, published } = parsed.data;

        await Post.updateOne(
            { _id: params.id  },
            { title, content, published }
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

const DeleteValidation = z.object({
    postId: z.string().trim().refine(
        (v) => mongoose.Types.ObjectId.isValid(v),
        {
            message: "Invalid tag ID"
        }
    ),
});

export async function DELETE(req: Request, { params }: { params: { id: string }}) {
    try {
        await connectToDB();

        const postIdSchema = DeleteValidation.shape.postId;
        const parsed = postIdSchema.safeParse(params.id);

        if (!parsed.success) {
            console.log("posts/[id]/DELETE: " + parsed.error.message);
            throw new HttpError(parsed.error.message, 400);
        }

        const postId = parsed.data;

        await Post.findByIdAndDelete(postId);

        return new NextResponse(null, { status: 204 });
    } catch (err:any) {
        console.error(err);
        return NextResponse.json(
            { success: false, message: err.message || "Internal Server Error" },
            { status: err.statusCode || 500 }
        );
    }
}