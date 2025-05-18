// app/create-post/page.tsx
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { getAllTags } from "@/lib/tags";
import CreatePostForm from "./CreatePostForm";

export default async function CreatePost() {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    let userId = null;

    if (token) {
        try {
            const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
            userId = decoded?.userId || decoded?._id;
        } catch (err) {
            console.error("JWT verification failed:", err);
            window.location.assign("/");
        }
    }

    const tags = await getAllTags(); 
    console.log("UserId: "+ userId);

    return (
        <div className="users-container">
            <h4 className="text-center my-2.5">Create Post</h4>
            <CreatePostForm tags={tags} userId={userId} />
        </div>
    );
}
