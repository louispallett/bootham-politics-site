"use client";

import { PostPopulated } from "@/lib/types";
import axios, { AxiosError, AxiosResponse } from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Posts() {
  const [loading, setLoading] = useState<boolean>(true);
  const [publishedPosts, setPublishedPosts] = useState<PostPopulated[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getPosts = () => {
      axios
        .get("/api/posts")
        .then((response: AxiosResponse) => {
          const publishedPosts = response.data.filter(
            (post: PostPopulated) => post.published,
          );
          setPublishedPosts(publishedPosts);
        })
        .catch((err: AxiosError) => {
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    };
    getPosts();
  }, []);

  return (
    <div className="grid-sm">
      {loading ? (
        <div className="flex items-center justify-center mt-16">
          <div className="users-container bg-blue-500! flex gap-2.5 p-4 items-center rounded-md">
            <div className="spinner h-12 w-12" />
          </div>
        </div>
      ) : (
        <>
          {publishedPosts.length > 0 ? (
            <>
              {publishedPosts.map((post: PostPopulated) => (
                <PostCard data={post} key={post._id} />
              ))}
            </>
          ) : (
            <div className="users-container">
              <h4>No Posts Yet</h4>
            </div>
          )}
        </>
      )}
      {error && <p>{error}</p>}
    </div>
  );
}

function PostCard({ data }: { data: PostPopulated }) {
  return (
    <Link href={"/home/" + data._id}>
      <div className="article-container">
        <div className="rounded-b-none rounded-lg p-2.5">
          <h4>{data.title}</h4>
        </div>
        {data.bannerURL && (
          <img src={data.bannerURL} alt="" className="object-cover" />
        )}
        <p className="self-start italic px-2.5 py-3.5 sm:px-3 sm:py-4 dark:text-slate-100">
          {data.synopsis}
        </p>
        <div className="p-2.5 self-end">
          <div className="tag-wrapper">
            {data.tags.map((tag) => (
              <TagCard data={tag.name} key={tag.name} />
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}

function TagCard({ data }: { data: string }) {
  return (
    <div className="tag-container shadow-none!">
      <p>
        <b>{data}</b>
      </p>
    </div>
  );
}
