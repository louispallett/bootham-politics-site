"use client";

// Note - it might be wise to move the forms in general into a separate file where both the create and
// update forms can draw from - the only difference here is the intial content, which can be an optional
// parameter.

import { PostType, TagType } from "@/lib/types";
import axios from "axios";
import { useParams } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import TinyEditor from "../TinyEditor";
import { CheckIcon } from "@heroicons/react/16/solid";
import Tags from "../Tags";

type Props = {
  postData: PostType;
  allTags: TagType[];
};

export default function UpdatePostForm({ postData, allTags }: Props) {
  const form = useForm();
  const params = useParams();
  const {
    register,
    control,
    handleSubmit,
    formState,
    watch,
    reset,
    setValue,
    trigger,
  } = form;
  const { errors } = formState;
  const [isPending, setIsPending] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState(null);
  const editorRef = useRef<any>(null);

  const onSubmit = (data: any) => {
    setIsPending(true);
    const selectedTags = Object.entries(data)
      .filter(([key, value]) => allTags.find((tag) => tag._id === key) && value)
      .map(([key]) => key);

    if (!editorRef.current) {
      console.log("Error with EditorRef");
      return;
    }

    const formData = new FormData();
    formData.append("content", editorRef.current.getContent());
    if (data.banner && data.banner.length > 0) {
      formData.append("banner", data.banner[0]);
    }
    formData.append("title", data.title);
    formData.append("bannerCaption", data.bannerCaption);
    formData.append("synopsis", data.synopsis);
    formData.append("tags", JSON.stringify(selectedTags));

    axios
      .put(`/api/posts/${params.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        setSuccess(true);
      })
      .catch((err: any) => {
        console.error(err.message);
        setServerError(err.message);
      })
      .finally(() => {
        setIsPending(false);
        setTimeout(() => {
          setSuccess(false);
        }, 3000);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      {postData ? (
        <>
          <div>
            <label htmlFor="title" className="font-bold dark:text-slate-100">
              Title
            </label>
            <input
              type="text"
              id="title"
              defaultValue={postData.title}
              className="form-input text-lg font-bold"
              {...register("title", {
                required: "Required",
              })}
            />
          </div>
          {postData.bannerURL && (
            <div>
              <p>
                <b>Current Banner</b>
              </p>
              <img src={postData.bannerURL} alt="" />
            </div>
          )}
          <div className="flex flex-col md:flex-row gap-2.5 md:items-end">
            <div>
              <label htmlFor="banner" className="font-bold dark:text-slate-100">
                Update Banner Image
              </label>
              <div className="flex items-center gap-5">
                <div className="self-center">
                  <input
                    type="file"
                    id="banner"
                    accept="image/*"
                    className="upload-btn"
                    {...register("banner", {})}
                  />
                </div>
              </div>
            </div>
            <div className="flex-1">
              <label htmlFor="bannerCaption" className="font-bold">
                Caption
              </label>
              <input
                type="text"
                className="form-input h-10"
                placeholder="Caption"
                {...register("bannerCaption", {})}
                defaultValue={postData.bannerCaption}
              />
            </div>
          </div>
          <div>
            <label htmlFor="synopsis" className="font-bold">
              Synopsis
            </label>
            <textarea
              id="synopsis"
              placeholder="Synopsis"
              className="form-input"
              {...register("synopsis", {
                required: "Required",
              })}
              defaultValue={postData.synopsis}
            ></textarea>
          </div>
          <div>
            <label htmlFor="content" className="font-bold">
              Content
            </label>
            <TinyEditor editorRef={editorRef} data={postData.content} />
          </div>
          {postData.tags && (
            <Tags
              allTags={allTags}
              register={register}
              selectedTags={postData.tags}
            />
          )}
        </>
      ) : (
        <div className="flex justify-center items-center p-4">
          <div className="spinner h-6 w-6"></div>
        </div>
      )}
      <div className="flex flex-col sm:grid grid-cols-2 gap-2.5">
        <button className="success" type="submit">
          {isPending ? (
            <div className="spinner h-6 w-6"></div>
          ) : (
            <>
              {success ? (
                <div className="flex items-center gap-1">
                  <CheckIcon className="h-5 w-6" />
                  <>Saved</>
                </div>
              ) : (
                <>Save</>
              )}
            </>
          )}
        </button>
        <button className="danger" type="button">
          {isPending ? <div className="spinner h-6 w-6"></div> : <>Delete</>}
        </button>
      </div>
    </form>
  );
}
