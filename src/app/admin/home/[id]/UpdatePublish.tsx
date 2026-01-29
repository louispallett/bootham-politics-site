"use client";

import axios, { AxiosError, AxiosResponse } from "axios";
import { useFormContext } from "./FormContext";
import {HttpError} from "@/lib/types";

type UpdatePublishProps = {
  postId: string;
};

export default function UpdatePublish({ postId }: UpdatePublishProps) {
  const {
    isPending,
    setIsPending,
    setServerError,
    isPublished,
    setIsPublished,
  } = useFormContext();

  const handlePublishChange = () => {
    setIsPending(true);
    axios
      .put(`/api/posts/${postId}/update-publish`)
      .then((response: AxiosResponse) => {
        setIsPublished(!isPublished);
      })
      .catch((err: AxiosError) => {
        console.error(err);
        if (axios.isAxiosError<HttpError>(err)) {
          setServerError({
            message: err.response?.data?.message ?? "Unknown",
            status: err.response?.status,
          });
        } else {
          setServerError({
            message: "Unexpected Error",
            status: 500,
          });
        }
      })
      .finally(() => {
        setIsPending(false);
      });
  };

  return (
    <button className="btn submit" onClick={handlePublishChange}>
      {isPending ? (
        <div className="spinner h-7 w-7"></div>
      ) : (
        <>{isPublished ? <>Unpublish</> : <>Publish</>}</>
      )}
    </button>
  );
}
