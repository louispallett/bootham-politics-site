'use client'

import axios, { AxiosResponse } from "axios";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form"

type Props = {
    title: string,
    content: string,
    tags: { _id: string, name: string }[]
}

export default function UpdatePostForm({ title, content, tags }: Props ) {
    const form = useForm();
    const params = useParams();
    const { register, control, handleSubmit, formState, watch, reset, setValue, trigger } = form;
    const { errors } = formState;
    const [isPending, setIsPending] = useState(false);
    const [success, setIsSuccess] = useState(false);
    const [serverError, setServerError] = useState(null);

    const onSubmit = (data:any) => {
        setIsPending(true);
        const selectedTags = Object.entries(data)
            .filter(([key, value]) => tags.find(tag => tag._id === key) && value)
            .map(([key]) => key);

        const payload = {
            ...data,
            tags: selectedTags,
        };

        axios.put(`/api/posts/${params.id}`, payload)
            .then((response:AxiosResponse) => {
                window.location.reload();
            }).catch((err:any) => {
                console.log(err.message);
                setServerError(err.message);
                setIsPending(false);
            })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            { (title && content && tags) ? (
                <>
                    <input type="text" defaultValue={title} className="form-input text-lg font-bold" 
                        {...register("title", {
                            required: "Required"
                        })}
                    />
                    <textarea defaultValue={content} className="form-input" 
                        {...register("content", {
                            required: "Required"
                        })}
                    ></textarea>
                </>
            ) : (
                <div className="flex justify-center items-center p-4">
                    <div className="spinner h-6 w-6"></div>
                </div>
            )}
            <div className="flex flex-col sm:grid grid-cols-2 gap-2.5">
                <button className="success" type="submit">
                    { isPending ? (
                        <div className="spinner h-6 w-6"></div>
                    ) : (
                        <>Save</>
                    )}
                </button>
                <button className="danger" type="button">
                    { isPending ? (
                        <div className="spinner h-6 w-6"></div>
                    ) : (
                        <>Submit</>
                    )}
                </button>
            </div>
        </form>
    )
}