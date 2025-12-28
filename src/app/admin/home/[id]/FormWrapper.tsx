"use client";

import { HttpError, PostType, TagType } from "@/lib/types";
import { useState } from "react";
import UpdatePostForm from "./UpdatePostForm";
import { FormContext } from "./FormContext";
import axios, { AxiosError } from "axios";
import { useParams } from "next/navigation";
import { useFormContext } from "./FormContext";

type Props = {
  postData: PostType;
  allTags: TagType[];
};

export default function FormWrapper({ postData, allTags }: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [serverError, setServerError] = useState<HttpError | null>(null);

  return (
    <FormContext.Provider
      value={{ isPending, setIsPending, serverError, setServerError }}
    >
      <div className="flex flex-col gap-2.5">
        <UpdatePostForm postData={postData} allTags={allTags} />
        <DeletePost />
        <FormErrorMessage />
      </div>
    </FormContext.Provider>
  );
}

function DeletePost() {
  const params = useParams();
  const [warning, setWarning] = useState<boolean>(false);
  const { isPending, setIsPending, setServerError } = useFormContext();

  const deletePost = () => {
    setServerError(null);
    setIsPending(true);
    setWarning(false);

    axios
      .delete(`/api/posts/${params.id}`)
      .then(() => {
        window.location.assign("/admin/home");
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
    <>
      {warning ? (
        <div className="danger">
          <h4>Warning</h4>
          <p>Are you sure you want to delete this post?</p>
          <p>
            Once deleted, the post, it's banner, and uploaded documents will not
            be recoverable.
          </p>
          <div className="flex mt-2.5 gap-2.5">
            <button className="btn danger" type="button" onClick={deletePost}>
              Delete
            </button>
            <button
              className="btn submit"
              type="button"
              onClick={() => setWarning(false)}
            >
              Close
            </button>
          </div>
        </div>
      ) : (
        <button
          className="btn danger"
          type="button"
          onClick={() => setWarning(true)}
        >
          {isPending ? <div className="spinner h-6 w-6"></div> : <>Delete</>}
        </button>
      )}
    </>
  );
}

function FormErrorMessage() {
  const { serverError } = useFormContext();
  return (
    <>
      {serverError && (
        <div className="danger flex justify-between">
          <p>
            <b>Error</b>: {serverError.message}
          </p>
          <p>
            <b>[{serverError.status}]</b>
          </p>
        </div>
      )}
    </>
  );
}
