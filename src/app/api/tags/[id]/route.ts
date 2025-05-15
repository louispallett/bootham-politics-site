import { NextResponse } from "next/server";
import Tag from "@/models/Tag";
import { connectToDB } from "@/lib/db";
import { z } from "zod";
import HttpError from "@/lib/HttpError";
import { getPostsWithTag } from "@/lib/posts";
import mongoose from "mongoose";
import { PostType } from "@/lib/types";


const PutValidation = z.object({
    tagId: z.string().trim().refine(
        (v) => mongoose.Types.ObjectId.isValid(v),
        {
            message: "Invalid tag ID"
        }
    ),
    name: z.string().trim().max(100)
});

export async function PUT(
    req:Request,
    { params }: { params: { tagId: string }}
) {
    try {
        await connectToDB();

        const body = await req.json();
        const parsed = PutValidation.safeParse({ tagId: params.tagId, ...body });
        
        if (!parsed.success) {
            return NextResponse.json({ error: parsed.error.message }, { status: 400 });
        }

        const { tagId, name } = parsed.data;

        await Tag.updateOne(
            { _id: tagId },
            { name: name }
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
    tagId: z.string().trim().refine(
        (v) => mongoose.Types.ObjectId.isValid(v),
        {
            message: "Invalid tag ID"
        }
    ),
});

export async function DELETE(
    req: Request,
    { params }: { params: { id: string }}
) {
    try {
        await connectToDB();

        const id = params.id;

        const tagIdSchema = DeleteValidation.shape.tagId;
        const parsed = tagIdSchema.safeParse(id);
        
        if (!parsed.success) {
            console.log(parsed.error.message);
            return NextResponse.json({ error: parsed.error.message }, { status: 400 });
        }

        const tagId = parsed.data;

        const postsWithTag = getPostsWithTag(tagId);
        const numOfPosts = (await postsWithTag).length;

        if (numOfPosts > 0) {
            const error = new HttpError(`${numOfPosts} post(s) have this tag applied. Remove the tag from these posts before deleting.`);
            error.statusCode = 400;
            throw error;
        }

        await Tag.findByIdAndDelete(tagId);

        return new NextResponse(null, { status: 204 });
    } catch (err:any) {
        console.error(err);
        return NextResponse.json(
            { success: false, message: err.message || "Internal Server Error" },
            { status: err.statusCode || 500 }
        );
    }
}