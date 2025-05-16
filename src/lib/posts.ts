import Post from "@/models/Post";
import { connectToDB } from "./db";
import { PostType } from "./types";

export async function getAllPosts(): Promise<PostType[]> {
    try {
        await connectToDB();
    
        const posts: PostType[] = await Post.find().populate({
            path: "author", select: "-_id firstName lastName"
        });
        return posts;
    } catch (err: any) {
        console.error("Error fetching posts:", err);
        throw new Error(err.message || "Server failed to fetch posts");
    }
}

export async function getPostById(id: string): Promise<PostType> {
    await connectToDB();

    const post = await Post.findById(id);
    return post;
}

export async function getPostsWithTag(tagId: string): Promise<PostType[]> {
	const posts: PostType[] = await Post.find({ tags: { $in: [tagId] } });
	return posts;
}
