"use client";

import axios, { AxiosError, AxiosResponse } from "axios";
import { useFormContext } from "./FormContext";

type UpdatePublishProps = {
  published: boolean;
  postId: string;
};

export default function UpdatePublish({
  published,
  postId,
}: UpdatePublishProps) {
  const { isPending, setIsPending, setServerError } = useFormContext();

  const handlePublishChange = () => {
    setIsPending(true);
    axios
      .put(`/api/posts/${postId}/update-publish`)
      .then((response: AxiosResponse) => {
        // TODO: If response is OK, we could update a state here.
        // Since we also have a published/notpublished notice at the start of the article, we need to have
        // this state in a parent folder.
        //
        // Or, alternatively:
        // window.location.reload(); // This is a quick fix... and we should update
      })
      .catch((err: AxiosError) => {
        console.error(err);
        setServerError({
          message: err?.response?.data?.message,
          status: err?.response?.status,
        });
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
        <>{published ? <>Unpublish</> : <>Publish</>}</>
      )}
    </button>
  );
}
