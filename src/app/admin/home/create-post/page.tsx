import { getAllTags } from "@/lib/tags.ts";
import CreatePostForm from "./CreatePostForm";

export default async function CreatePost() {
    const tags = await getAllTags(); 

    return (
        <div className="users-container">
            <h4 className="text-center my-2.5">Create Post</h4>
            <CreatePostForm tags={tags} />
        </div>
    )
}
