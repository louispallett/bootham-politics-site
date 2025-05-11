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
            <div className="flex flex-col md:grid grid-cols-3 gap-2.5">
                <CreatePostBtn />
                <CreateTagBtn />
                <AccountSettingsBtn />
            </div>
            <div className="flex flex-col md:grid grid-cols-2 gap-2.5">
                <div className="flex flex-col gap-2.5">
                    <h4>Published</h4>
                    <Posts posts={published} />
                </div>
                <div className="flex flex-col gap-2.5">
                    <h4 className="text-right">Not Published</h4>
                    <Posts posts={notPublished} />
                </div>
            </div>
        </div>
    )
}

function CreatePostBtn() {
    return (
        <Link href="home/create-post" className="success">
            Create Post
        </Link>
    )
}

function CreateTagBtn() {
    return (
        <Link href="home/create-tag" className="success">
            Create Tag
        </Link>
    )
}

function AccountSettingsBtn() {
    return (
        <Link href="home/account" className="submit">
            Account Settings
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
        </div>
    )
}