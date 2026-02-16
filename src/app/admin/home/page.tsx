import Link from "next/link";
import PostsWrapper from "./PostsWrapper";

export const runtime = "nodejs";

export default async function AdminHome() {
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
      <PostsWrapper />
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
