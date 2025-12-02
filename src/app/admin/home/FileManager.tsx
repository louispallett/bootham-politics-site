"use client";

import { getIcon } from "@/app/auxiliary";
import { DocumentType } from "@/lib/types";
import axios from "axios";
import { useState } from "react";

type FileManagerProps = {
  postDocuments: DocumentType[];
  deleting: boolean;
  setDeleting: (v: boolean) => void;
};

export default function FileManager({
  postDocuments,
  deleting,
  setDeleting,
}: FileManagerProps) {
  return (
    <div className="standard-container file-uploader">
      <h4>File Manager</h4>
      <div className="flex flex-col my-2.5 gap-2.5">
        {postDocuments.length > 0 ? (
          <>
            {postDocuments.map((file) => (
              <FileCard
                file={file}
                url={file.url}
                key={file._id}
                deleting={deleting}
                setDeleting={setDeleting}
              />
            ))}
          </>
        ) : (
          <p>No documents.</p>
        )}
      </div>
    </div>
  );
}

type FileCardProps = {
  file: DocumentType;
  url?: string;
  deleting: boolean;
  setDeleting: (v: boolean) => void;
};

function FileCard({ file, url, deleting, setDeleting }: FileCardProps) {
  const icon = getIcon(file.mimeType);
  const [error, setError] = useState<string | null>(null);
  const handleDelete = () => {
    setDeleting(true);
    axios
      .delete(`/api/documents/${file._id}`)
      .then(() => {})
      .catch((err: any) => {
        console.error(err);
        setError(err.message);
      })
      .finally(() => {
        setDeleting(false);
      });
  };

  return (
    <div className="flex gap-2.5">
      <a className="flex-1" href={url} target="_blank">
        <div className="standard-container flex items-center gap-2.5">
          <img src={`/images/file-icons/${icon}.svg`} className="h-8" />
          <p>
            <b>{file.originalName}</b>
          </p>
        </div>
      </a>
      {deleting ? (
        <div className="danger">
          <div className="spinner h-6 w-6"></div>
        </div>
      ) : (
        <button className="danger" onClick={handleDelete}>
          Delete
        </button>
      )}
    </div>
  );
}
