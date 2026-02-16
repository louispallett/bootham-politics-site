"use client";

import { useEffect, useState } from "react";
import axios, { AxiosError, AxiosResponse } from "axios";
import { DocumentType, PostPopulated } from "@/lib/types";
import { getIcon } from "@/app/auxiliary";

export default function Post({ id }: { id: string }) {
  const [data, setData] = useState<PostPopulated | null>(null);
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getData = () => {
      axios
        .get(`/api/posts/${id}`)
        .then((response: AxiosResponse) => {
          setData(response.data);
        })
        .catch((err: AxiosError) => {
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    };

    const getDocuments = () => {
      axios
        .get(`/api/documents/byPost/${id}`)
        .then((response: AxiosResponse) => {
          setDocuments(response.data);
        })
        .catch((err: AxiosError) => {
          setError(err.message);
        });
    };

    getData();
    getDocuments();
  }, []);

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center mt-16">
          <div className="spinner h-12 w-12" />
        </div>
      ) : (
        <>
          {data ? <Article data={data} /> : <p>Post not found.</p>}
          {documents.length > 0 && <Documents documents={documents} />}
        </>
      )}
      {error && <p>{error}</p>}
    </>
  );
}

type ArticleProps = {
  data: PostPopulated;
};

function Article({ data }: ArticleProps) {
  return (
    <div className="users-container border-none p-0!">
      <div className="rounded-b-none rounded-lg p-2.5">
        <h4>{data.title}</h4>
      </div>
      {data.bannerURL && (
        <img
          src={data.bannerURL}
          alt=""
          className="object-cover max-h-full min-w-full"
        />
      )}
      {data.bannerCaption && (
        <p className="text-right px-2.5">
          <i>{data.bannerCaption}</i>
        </p>
      )}
      <div className="article p-1.5 sm:px-3 sm:py-4">
        <div className="article-synopsis-wrapper">
          <p className="italic dark:text-slate-100">{data.synopsis}</p>
          <p className="article-author">
            {data.author.firstName} {data.author.lastName}
          </p>
        </div>
        <div
          className="article-inner dark:text-slate-100"
          dangerouslySetInnerHTML={{ __html: data.content }}
        ></div>
        <div className="self-end">
          <div className="flex gap-2.5">
            {data.tags.map((tag) => (
              <TagCard data={tag.name} key={tag.name} />
            ))}
          </div>
        </div>
      </div>
    </div>
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

type DocumentsProps = {
  documents: DocumentType[];
};

function Documents({ documents }: DocumentsProps) {
  return (
    <div className="users-container border-none p-0! mt-5">
      <div className="rounded-b-none rounded-lg p-2.5">
        <h4>Documents</h4>
      </div>
      <div className="flex flex-col m-2.5 gap-2.5">
        {documents.map((document: DocumentType) => (
          <FileCard file={document} key={document._id} />
        ))}
      </div>
    </div>
  );
}

type FileCardProps = {
  file: DocumentType;
};

function FileCard({ file }: FileCardProps) {
  const icon = getIcon(file.mimeType);
  return (
    <div className="flex gap-2.5">
      <a className="flex-1" href={file.url} target="_blank">
        <div className="flex items-center gap-2.5">
          <img src={`/images/file-icons/${icon}.svg`} className="h-8" />
          <p>
            <b>{file.originalName}</b>
          </p>
        </div>
      </a>
    </div>
  );
}
