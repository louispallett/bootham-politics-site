import { PostPopulated, PostType } from "@/lib/types";
import { getAllPosts } from "@/lib/posts";
import Link from "next/link";

export const runtime = "nodejs";

export default async function AdminHome() {
  const posts = await getAllPosts();

  const published = posts.filter((post) => post.published);
  const notPublished = posts.filter((post) => !post.published);

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex flex-col md:grid grid-cols-3 gap-2.5">
        <CreatePostBtn />
        <CreateTagBtn />
        <AccountSettingsBtn />
      </div>
      <div className="hidden users-container md:flex justify-between">
        <h4>Published</h4>
        <h4>Not Published</h4>
      </div>
      <div className="flex flex-col md:grid grid-cols-2 gap-2.5">
        <div className="flex flex-col gap-2.5">
          <h4 className="standard-container success md:hidden">Published</h4>
          <Posts posts={published} />
        </div>
        <div className="flex flex-col gap-2.5">
          <h4 className="standard-container danger mt-5 md:hidden">
            Not Published
          </h4>
          <Posts posts={notPublished} />
        </div>
      </div>
    </div>
  );
}

function CreatePostBtn() {
  return (
    <Link href="home/create-post" className="btn success">
      Create Post
    </Link>
  );
}

function CreateTagBtn() {
  return (
    <Link href="home/manage-tags" className="btn success">
      Tags
    </Link>
  );
}

function AccountSettingsBtn() {
  return (
    <Link href="home/account" className="btn submit">
      Account Settings
    </Link>
  );
}

function Posts({ posts }: { posts: PostPopulated[] }) {
  return (
    <>
      {posts.length > 0 ? (
        <>
          {posts.map((post) => (
            <PostCard data={post} key={post._id} />
          ))}
        </>
      ) : (
        <div className="users-container">
          <p>No posts yet</p>
        </div>
      )}
    </>
  );
}

function PostCard({ data }: { data: PostPopulated }) {
  //? Note the shown errors below are a TS over-zealous one because data.author is technically a _id string
  const fullName = data.author
    ? data.author.firstName + " " + data.author.lastName
    : "Unknown Author";

  return (
    <Link href={`home/${data._id}`} className="users-container">
      <h4>{data.title}</h4>
      <p>{data.synopsis}</p>
      <p className="text-right font-bold">{fullName}</p>
      <p className="text-right">{data.creationDateFormatted}</p>
    </Link>
  );
}
