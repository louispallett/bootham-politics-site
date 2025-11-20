"use client";

import axios from "axios";
import React, { useState } from "react";

type FileUploaderProps = {
  postId: string;
};

export default function FileUploader({ postId }: FileUploaderProps) {
  const [uploading, setUploading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage("");

    try {
      await uploadFile(file, postId);
      setMessage("Upload Successful");
    } catch (err: any) {
      console.error(err);
      setMessage(err.message || "Upload Failed");
    } finally {
      setUploading(false);
    }
  }
  return (
    <div className="standard-container file-uploader">
      <h4>File Uploader</h4>
      <p>
        Use the button below to upload any documents you want users to be able
        to read and download along with the article. Some rules to be aware of:
      </p>
      <ul>
        <li>You can only attach PDF, Word, or Open Office files.</li>
        <li>Each file cannot exceed 10MB in size.</li>
        <li>You can only upload a maximum of 10 files per article.</li>
      </ul>
      <input
        type="file"
        id="banner"
        accept=".odt,.pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="upload-btn"
        onChange={handleFileChange}
      />
      {uploading && <p>Uploading...</p>}
      {!uploading && message && <p>{message}</p>}
    </div>
  );
}

export async function uploadFile(file: File, postId: string) {
  //----------------------------
  // 1. Request Presigned URL
  //----------------------------
  const presignRes = await axios.post("/api/documents/presign", {
    filename: file.name,
    size: file.size,
    mimeType: file.type,
    postId,
  });

  const { uploadUrl, s3Key } = presignRes.data;

  //----------------------------
  // 2. Upload directly to S3
  //----------------------------
  await axios.put(uploadUrl, file, {
    headers: {
      "Content-Type": file.type,
    },
    //! Prevents Axios from messing with the S3 PUT payload
    transformRequest: [(data) => data],
  });

  //----------------------------
  // 3. Register metadata in DB
  //----------------------------
  await axios.post("/api/documents/register", {
    postId,
    originalName: file.name,
    mimeType: file.type,
    size: file.size,
    s3Key,
  });

  return true;
}
