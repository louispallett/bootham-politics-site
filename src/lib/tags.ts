import Tag from "@/models/Tag";
import { connectToDB } from "./db";
import { TagType } from "./types";
import { NextResponse } from "next/server";

export async function getAllTags(): Promise<TagType[]> {
    try {
        await connectToDB();

        const tags: TagType[] = await Tag.find({}).lean();
        return tags.map(tag => ({
            ...tag,
            _id: tag._id.toString()
    	}));
    } catch(err: any) {
        console.error("Error fetching posts:", err);
        throw new Error(err.message || "Server failed to fetch posts");
    }
}
