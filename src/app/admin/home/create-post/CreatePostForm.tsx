'use client'

import axios, { AxiosResponse } from "axios";
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

    const onSubmit = (data: any) => {
        setIsPending(true);
        const selectedTags = Object.entries(data)
            .filter(([key, value]) => tags.find(tag => tag._id === key) && value)
            .map(([key]) => key);

        const formData = new FormData();
        if (data.banner && data.banner.length > 0) {
            formData.append('banner', data.banner[0]);
        }
        formData.append('title', data.title);
        formData.append('synopsis', data.synopsis);
        formData.append('content', data.content);
        formData.append('tags', JSON.stringify(selectedTags));

        axios.post(`/api/posts`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        })
        .then((response: AxiosResponse) => {
            // window.location.assign(`/admin/home/${response.data._id}`);
        })
        .catch((err: any) => {
            console.log(err.message);
            setServerError(err.message);
        })
        .finally(() => {
            setIsPending(false);
        });
    };


    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <input type="text" className="form-input" placeholder="Title" required
                {...register("title", {
                    required: "Required"
                })}
            />
            <div className="flex gap-2.5 items-center">
                <div>
                    <label htmlFor="banner" className="font-bold dark:text-slate-100">Banner Image</label>
                    <div className="flex items-center gap-5">
                        <div className="self-center">
                            <input
                                type="file"
                                id="banner"
                                accept="image/*"
                                className="block w-full text-sm text-gray-800
                                    h-10 py-2 px-4 {/* Added h-10 */}
                                    rounded-sm border-0
                                    text-sm font-semibold
                                    bg-slate-300 text-blue-700
                                    hover:bg-blue-100
                                    cursor-pointer
                                    border-2 border-gray-600 rounded-md shadow-md
                                    focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
                                {...register("banner", {})}
                            />
                        </div>
                    </div>
                </div>
                <div className="flex-1">
                    <label htmlFor="bannerCaption" className="font-bold">Caption</label>
                    <input
                        type="text"
                        className="form-input h-10"
                        placeholder="Caption"
                        {...register("bannerCaption", {
                            required: "Required"
                        })}
                    />
                </div>
            </div>
            <textarea id="synopsis" placeholder="Synopsis"
                className="form-input" {...register("synopsis", {
                    required: "Required"
                })}
            ></textarea>
            <textarea id="content" placeholder="Content"
                className="form-input" {...register("content", {
                    required: "Required"
                })}
            ></textarea>
            <Tags tags={tags} register={register} />
            <button className="submit">
                { isPending ? (
                    <div className="spinner h-6 w-6"></div>
                ) : (
                    <>Submit</>
                )}
            </button>
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