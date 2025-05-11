import { GET } from "@/app/api/tags/route";
import CreatePostForm from "./CreatePostForm";

const res = await GET();
const json = await res.json();
const tags = json.tags;
console.log(tags);

export default function CreatePost() {
    return (
        <div className="users-container">
            <h4 className="text-center my-2.5">Create Post</h4>
            <CreatePostForm tags={tags} />
        </div>
    )
}