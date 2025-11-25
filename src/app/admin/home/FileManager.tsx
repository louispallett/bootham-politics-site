"use client";

import { DocumentType } from "@/lib/types";

type FileManagerProps = {
  postDocuments: DocumentType[];
};

export default function FileManager({ postDocuments }: FileManagerProps) {
  return (
    <div className="standard-container file-uploader">
      <h4>File Manager</h4>
      {postDocuments.map((file) => (
        <FileCard file={file} url={file.url} key={file._id} />
      ))}
    </div>
  );
}

type FileCardProps = {
  file: DocumentType;
  url?: string;
};

function FileCard({ file, url }: FileCardProps) {
  return (
    <>
      <p>
        <a href={url} target="_blank">
          {file.originalName}
        </a>
      </p>
    </>
  );
}
