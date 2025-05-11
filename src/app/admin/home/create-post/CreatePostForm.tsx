'use client'

import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { Tag } from "@/lib/types";

export default function CreatePostForm({ tags }: { tags: Tag[] }) {
    const form = useForm();
    const { register, control, handleSubmit, formState, watch, reset, setValue, trigger } = form;
    const { errors } = formState;
    const [isPending, setIsPending] = useState(false);
    const [success, setIsSuccess] = useState(false);
    const [serverError, setServerError] = useState(null);

    // We need to pass the token to the server and then fetch the _id of the 
    // user to set it as the author

    const onSubmit = (data:object) => {
        setIsPending(true);
        axios.post(`/api/posts/create`, data)
            .then((response:object) => {
                setIsSuccess(true);
            }).catch((err:any) => {
                console.log(err.message);
                setServerError(err.message);
                setIsPending(false);
            }).finally(() => {
                // send to update route
            })
    }


    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <input type="text" className="form-input" placeholder="Title" required
                {...register("title", {
                    required: "Required"
                })}
            />
            <textarea name="content" id="content" placeholder="Content"
                className="form-input"
            ></textarea>
            <Tags tags={tags} register={register} />
            <button className="submit">Submit</button>
        </form>
    )
}

function Tags({ tags, register }: { tags: Tag[], register: any }) {
    return (
        <div className="tag-container">
            <h4>Tags</h4>
            <p className="my-1.5">Tags are optional and you can add or remove them at any time. Click <Link href="/admin/home/create-tag" className="link">here</Link> to create a new tag</p>
            <div className="flex gap-5">
                { tags.map((tag) => (
                    <TagCard tag={tag} register={register} key={tag._id} />
                ))}
            </div>
        </div>
    )
}

function TagCard({ tag, register }: { tag: Tag, register: any }) {
    return (
        <div className="flex gap-1 justify-center items-center">
            <input type="checkbox" id={tag._id} name={tag._id} 
                {...register(tag.name, {})}
            />
            <label htmlFor={tag._id}>{tag.name}</label>
        </div>
    )
}