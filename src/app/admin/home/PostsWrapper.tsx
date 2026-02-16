"use client";

import { PostPopulated } from "@/lib/types";
import axios, { AxiosError, AxiosResponse } from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PostsWrapper() {
  const [published, setPublished] = useState<PostPopulated[]>([]);
  const [notPublished, setNotPublished] = useState<PostPopulated[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const getPosts = () => {
      axios
        .get("/api/posts")
        .then((response: AxiosResponse) => {
          const posts = response.data;
          setPublished(posts.filter((post: PostPopulated) => post.published));
          setNotPublished(
            posts.filter((post: PostPopulated) => !post.published),
          );
        })
        .catch((err: AxiosError) => {})
        .finally(() => {
          setLoading(false);
        });
    };
    getPosts();
  }, []);

  return (
    <div className="flex flex-col md:grid grid-cols-2 gap-2.5">
      <div className="flex flex-col gap-2.5">
        <h4 className="standard-container success md:hidden">Published</h4>
        {loading ? (
          <div className="flex items-center justify-center mt-16">
            <div className="spinner h-12 w-12" />
          </div>
        ) : (
          <Posts posts={published} />
        )}
      </div>
      <div className="flex flex-col gap-2.5">
        <h4 className="standard-container danger mt-5 md:hidden">
          Not Published
        </h4>
        {loading ? (
          <div className="flex items-center justify-center mt-16">
            <div className="spinner h-12 w-12" />
          </div>
        ) : (
          <Posts posts={notPublished} />
        )}
      </div>
    </div>
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
