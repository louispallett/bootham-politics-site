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
    const [success, setIsSuccess] = useState(false);
    const [serverError, setServerError] = useState(null);

    const onSubmit = (data:object) => {
        setIsPending(true);
        axios.put(`/api/tags`, data)
            .then((response:object) => {
                setIsSuccess(true);
            }).catch((err:any) => {
                console.log(err.message);
                setServerError(err.message);
                setIsPending(false);
            }).finally(() => {
                // send to update route
            })
        console.log(data);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="flex flex-col gap-2.5">
                <h4>Current Tags</h4>
                { tags.map(tag => (
                    <TagCard tag={tag} key={tag._id} register={register} />
                ))}
            </div>
            <button className="success">Save</button>
        </form>
    )
}

function TagCard({ tag, register }: { tag: TagType, register: any }) {
    const [deleted, setDeleted] = useState(false);
    const [isPending, setIsPending] = useState(false);

    const tagId = tag._id;

    const handleDelete = () => {
        setIsPending(true);
        axios.delete(`/api/tags/${tagId}`)
            .then(() => {
                setDeleted(true);
            }).catch((err) => {
                console.log(err);
            }).finally(() => {
                setIsPending(false);
            })
    }

    return (
        <div className={deleted ? "hidden" : "users-container"}>
            <div className="flex justify-between gap-2.5">
                <input type="text" defaultValue={tag.name} className="form-input"
                    {...register(tagId, {
                        required: true
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
        </div>
    )
}