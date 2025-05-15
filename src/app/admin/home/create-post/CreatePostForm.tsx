'use client'

import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { TagType } from "@/lib/types";

export default function CreatePostForm({ tags }: { tags: TagType[] }) {
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
        const selectedTags = Object.entries(data)
            .filter(([key, value]) => tags.find(tag => tag._id === key) && value)
            .map(([key]) => key);

        const payload = {
            ...data,
            tags: selectedTags
        };

        axios.post(`/api/posts`, payload)
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
            <textarea id="content" placeholder="Content"
                className="form-input" {...register("content", {
                    required: "Required"
                })}
            ></textarea>
            <Tags tags={tags} register={register} />
            <button className="submit">Submit</button>
        </form>
    )
}

function Tags({ tags, register }: { tags: TagType[], register: any }) {
    return (
        <div className="tag-container">
            <h4>Tags</h4>
            <p className="my-1.5">Tags are optional and you can add or remove them at any time. Click <Link href="/admin/home/manage-tags" className="link">here</Link> to create a new tag</p>
            <div className="flex flex-wrap gap-5">
                { tags.map((tag) => (
                    <TagCard tag={tag} register={register} key={tag._id} />
                ))}
            </div>
        </div>
    )
}

function TagCard({ tag, register }: { tag: TagType, register: any }) {
    return (
        <div className="flex gap-1 flex-wrap justify-center items-center">
            <input type="checkbox" id={tag._id} name={tag._id} 
                {...register(tag._id, {})}
            />
            <label htmlFor={tag._id}>{tag.name}</label>
        </div>
    )
}