import { Post } from "@/lib/types";
import { GET } from "@/app/api/posts/route";
import Link from "next/link";

export default async function AdminHome() {
    const res = await GET();
    const posts: Post[] = await res.json();

    const published = posts.filter(post=> post.published);
    const notPublished = posts.filter(post => !post.published);

    return (
        <div className="flex flex-col gap-2.5">
            <div className="flex flex-col md:grid grid-cols-2 gap-2.5">
                <CreatePostButton />
                <AccountSettingsButton />
            </div>
            <div className="flex flex-col md:grid grid-cols-2 gap-2.5">
                <div className="flex flex-col gap-2.5">
                    <h4>Published</h4>
                    <Posts posts={published} />
                </div>
                <div className="flex flex-col gap-2.5">
                    <h4>Not Published</h4>
                    <Posts posts={notPublished} />
                </div>
            </div>
        </div>
    )
}

function CreatePostButton() {
    return (
        <Link href="home/create">
            <button className="success">
                Create Post
            </button>
        </Link>
    )
}

function AccountSettingsButton() {
    return (
        <Link href="home/account">
            <button className="submit">
                Account Settings
            </button>
        </Link>
    )
}

function Posts({ posts } : { posts: Post[] }) {
    return (
        <>
            { posts.length > 0 ? (
                <>
                    { posts.map((post) => (
                        <PostCard data={post} key={post._id} />
                    ))}
                </>
            ) : (
                <div className="users-container">
                    <p>No posts yet</p>
                </div>
            )}
        </>
    )
}

function PostCard({ data }: { data: Post }) {
    return (
        <div className="">
            <p>{data.title}</p>
            <p>{data.content}</p>
        </div>
    )
}