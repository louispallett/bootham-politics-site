import { getPostById } from "@/lib/posts"
import UpdatePostForm from "./UpdatePostForm";
import UpdatePublish from "./UpdatePublish";

export default async function UpdatePost({ params }: { params: { id: string }}) {
    const { id } = await params; 
    const data = await getPostById(id);

    // NextJS throws warning if we don't convert _id to simple string:
    for (let tag of data.tags) {
        tag._id = tag._id.toString();
    }

    const fullName = data.author ? data.author.firstName + " " + data.author.lastName : "Unknown Author";
    
    return (
        <div className="users-container flex flex-col gap-2.5">
            <PostInfo published={data.published} author={fullName}/>
            <UpdatePostForm title={data.title} content={data.content} tags={data.tags}/>
            <UpdatePublish published={data.published} />
        </div>
    )
}

function PostInfo({ published, author }: { published: boolean, author: string }) {
    return (
        <>
            <p className="text-right">Created by <b>{author}</b></p>
            { published ? (
                <div className="success self-start">Published</div>
            ) : (
                <div className="danger self-start">Not Published</div>
            )}
        </>
    )
}