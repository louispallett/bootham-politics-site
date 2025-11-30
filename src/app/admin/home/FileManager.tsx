"use client";

import { DocumentType } from "@/lib/types";

type FileManagerProps = {
  postDocuments: DocumentType[];
};

export default function FileManager({ postDocuments }: FileManagerProps) {
  return (
    <div className="standard-container file-uploader">
      <h4>File Manager</h4>
      <div className="flex flex-col my-2.5 gap-2.5">
        {postDocuments.map((file) => (
          <FileCard file={file} url={file.url} key={file._id} />
        ))}
      </div>
    </div>
  );
}

type FileCardProps = {
  file: DocumentType;
  url?: string;
};

function FileCard({ file, url }: FileCardProps) {
  const icon = getIcon(file.mimeType);

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
      <button className="danger">Delete</button>
    </div>
  );
}

const getIcon = (mimeType: string) => {
  switch (mimeType) {
    case "application/pdf":
      return "pdf";
    case "application/msword":
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return "word";
    case "application/vnd.ms-excel":
    case "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
      return "excel";
    case "application/vnd.ms-powerpoint":
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return "powerpoint";
    case "application/vnd.oasis.opendocument.text":
    case "application/vnd.oasis.opendocument.spreadsheet":
    case "application/vnd.oasis.opendocument.presentation":
      return "text";
    default:
      return "default";
  }
};
