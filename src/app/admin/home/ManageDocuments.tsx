"use client";

import FileUploader from "./FileUploader";
import FileManager from "./FileManager";
import { DocumentType } from "@/lib/types";
import Loading from "./loading";
import { useEffect, useState } from "react";
import axios from "axios";

type ManageDocumentsProps = {
  postId: string;
};

export default function ManageDocuments({ postId }: ManageDocumentsProps) {
  const [postDocuments, setPostDocuments] = useState<DocumentType[]>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  useEffect(() => {
    const getDocuments = () => {
      axios
        .get(`/api/documents/byPost/${postId}`)
        .then((response: any) => {
          setPostDocuments(response.data);
        })
        .catch((err: any) => {
          console.error(err);
        });
    };
    getDocuments();
  }, [uploading]);

  return (
    <>
      {postDocuments ? (
        <>
          <FileManager
            postDocuments={JSON.parse(JSON.stringify(postDocuments))}
          />
          <FileUploader
            postId={postId}
            uploading={uploading}
            setUploading={setUploading}
          />
        </>
      ) : (
        <Loading />
      )}
    </>
  );
}
