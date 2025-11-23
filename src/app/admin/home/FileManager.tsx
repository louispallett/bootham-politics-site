"use client";

import { DocumentType } from "@/lib/types";
import axios from "axios";
import { useEffect, useState } from "react";

type FileManagerProps = {
  postDocuments: DocumentType[];
};

export default function FileManager({ postDocuments }: FileManagerProps) {
  return (
    <div className="standard-container file-uploader">
      <h4>File Manager</h4>
      {postDocuments.map((file) => (
        <FileCard file={file} key={file._id} />
      ))}
    </div>
  );
}

type FileCardProps = {
  file: DocumentType;
};

function FileCard({ file }: FileCardProps) {
  const [url, setUrl] = useState<string>("");

  useEffect(() => {
    const getUrl = () => {
      axios
        .get(`/api/documents/download/${file._id}`)
        .then((response: any) => {
          setUrl(response.data.url);
        })
        .catch((err: any) => {
          console.error(err);
        });
    };
    getUrl();
  });

  return (
    <>
      <p>
        <a href={url}>{file.originalName}</a>
      </p>
    </>
  );
}
