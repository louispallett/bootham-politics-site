'use client'

import axios from "axios";
import { useForm } from "react-hook-form";
import { TagType } from "@/lib/types";
import { useState } from "react"

export default function AllTags({ tags }: { tags: TagType[] }) {
    const form = useForm();
    const { register, control, handleSubmit, formState, watch, reset, setValue, trigger } = form;
    const { errors } = formState;
    const [isPending, setIsPending] = useState(false);
    // const [success, setIsSuccess] = useState(false);
    const [serverError, setServerError] = useState(null);

    const onSubmit = (data:object) => {
        setServerError(null);
        setIsPending(true);
        axios.put(`/api/tags`, data)
        .then(() => {
                // setIsSuccess(true);
            }).catch((err:any) => {
                console.log(err.response.data.message);
                setServerError(err.response.data.message);
            }).finally(() => {
                setIsPending(false);
            })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="flex flex-col gap-2.5">
                <h4>Current Tags</h4>
                { tags.map(tag => (
                    <TagCard tag={tag} key={tag._id} register={register} errors={errors} />
                ))}
            </div>
            { serverError && (
                <span className="bg-red-600 text-white font-bold self-start px-2.5 rounded">
                    {serverError}
                </span>
            )}
            <button className="success">
                { isPending ? (
                    <div className="spinner h-6 w-6"></div>
                ) : (
                    <>
                        Save
                    </>
                )}
            </button>
        </form>
    )
}

function TagCard({ tag, register, errors }: { tag: TagType, register: any, errors: any }) {
    const [deleted, setDeleted] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [serverError, setServerError] = useState(null);

    const tagId = tag._id;

    const handleDelete = () => {
        setIsPending(true);
        axios.delete(`/api/tags/${tagId}`)
            .then(() => {
                setDeleted(true);
            }).catch((err) => {
                console.log(err.response.data.message);
                setServerError(err.response.data.message);
            }).finally(() => {
                setIsPending(false);
            })
    }

    return (
        <div className={deleted ? "hidden" : "users-container"}>
            <div className="flex justify-between gap-2.5">
                <input type="text" defaultValue={tag.name} className="form-input"
                    {...register(tagId, {
                        required: "Error: Please ensure no tags are empty.",
                    })}
                />
                <button className="danger" type="button"
                    onClick={handleDelete}
                >
                    { isPending ? (
                        <div className="spinner h-6 w-6"></div>
                    ) : (
                        <>
                            Delete
                        </>
                    )}
                </button>
            </div>
            { serverError && (
                <span className="text-white font-bold self-start px-2.5 rounded">
                    {serverError}
                </span>
            )}
            {/* <span className="bg-red-600 text-white font-bold self-start px-2.5 rounded">
                {typeof errors.tagId?.message === "string" ? errors.tagId.message : null}
            </span> */}
        </div>
    )
}