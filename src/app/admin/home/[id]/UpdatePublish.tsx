"use client";

import axios, { AxiosError, AxiosResponse } from "axios";
import { useState } from "react";

type UpdatePublishProps = {
  published: boolean;
  postId: string;
};

export default function UpdatePublish({
  published,
  postId,
}: UpdatePublishProps) {
  const [loading, setLoading] = useState<boolean>(false);

  const handlePublishChange = () => {
    setLoading(true);
    axios
      .put(`/api/posts/update-publish/${postId}`)
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
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <button className="btn submit" onClick={handlePublishChange}>
      {loading ? (
        <div className="spinner h-7 w-7"></div>
      ) : (
        <>{published ? <>Unpublish</> : <>Publish</>}</>
      )}
    </button>
  );
}
