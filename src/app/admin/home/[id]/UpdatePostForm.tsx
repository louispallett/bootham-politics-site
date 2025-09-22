'use client'

import axios, { AxiosResponse } from "axios";
import { useParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form"

type Props = {
    title: string,
    bannerURL?:string,
    bannerCaption?:string,
    synopsis:string,
    content: string,
    tags?: { _id: string, name: string }[]
}

export default function UpdatePostForm({ title, bannerURL, bannerCaption, synopsis, content, tags }: Props ) {
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

        const formData = new FormData();
        if (data.banner && data.banner.length > 0) {
            formData.append('banner', data.banner[0]);
        }
        formData.append("title", data.title);
        formData.append("bannerCaption", data.bannerCaption);
        formData.append("synopsis", data.synopsis);
        formData.append("content", data.content);
        formData.append("tags", JSON.stringify(selectedTags));

        axios.put(`/api/posts/${params.id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            },
        }).then((response:AxiosResponse) => {
            window.location.reload();
        }).catch((err:any) => {
            console.log(err.message);
            setServerError(err.message);
            setIsPending(false);
        });
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {(title && synopsis && content && tags) ? (
                <>
                    <input type="text" defaultValue={title} className="form-input text-lg font-bold" 
                        {...register("title", {
                            required: "Required"
                        })}
                    />
                    { bannerURL && (
                        <div className="">
                            <p><b>Current Banner</b></p>
                            <img src={bannerURL} alt="" />
                        </div>
                    )}
                    <div className="flex flex-col md:flex-row gap-2.5 md:items-end">
                        <div>
                            <label htmlFor="banner" className="font-bold dark:text-slate-100">Update Banner Image</label>
                            <div className="flex items-center gap-5">
                                <div className="self-center">
                                    <input
                                        type="file"
                                        id="banner"
                                        accept="image/*"
                                        className="img-upload-btn"
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
                                {...register("bannerCaption", {})}
                                defaultValue={bannerCaption}
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="synopsis" className="font-bold">Synopsis</label>
                        <textarea id="synopsis" placeholder="Synopsis"
                            className="form-input" {...register("synopsis", {
                                required: "Required"
                            })}
                            defaultValue={synopsis}
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="content" className="font-bold">Content</label>
                        <textarea defaultValue={content} className="form-input" placeholder="Content"
                            id="content"
                            {...register("content", {
                                required: "Required"
                            })}
                        ></textarea>
                    </div>
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
                        <>Delete</>
                    )}
                </button>
            </div>
        </form>
    )
}