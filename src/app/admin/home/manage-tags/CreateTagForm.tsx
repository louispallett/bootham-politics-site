'use client'

import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";


export default function Form() {
    const form = useForm();
    const { register, control, handleSubmit, formState, watch, reset, setValue, trigger } = form;
    const { errors } = formState;
    const [isPending, setIsPending] = useState(false);
    const [serverError, setServerError] = useState(null);

    const onSubmit = (data:object) => {
        setIsPending(true);
        axios.post(`/api/tags`, data)
            .then((response:object) => {
                window.location.reload();
            }).catch((err:any) => {
                console.log(err.response.data.message);
                setServerError(err.response.data.message);
                setIsPending(false);
            }).finally(() => {
                setIsPending(false);
            })
    }


    return (
        <div className="users-container lg:self-start">
            <h4>Create Tag</h4>
            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <input type="text" className="form-input" placeholder="Name" required
                    {...register("name", {
                        required: "Required"
                    })}
                />
                <button className="submit">
                    { isPending ? (
                        <div className="spinner h-6 w-6"></div>
                    ) : (
                        <>
                            Create
                        </>
                    )}
                </button>
                { serverError && (
                    <div className="bg-red-600 text-white font-bold self-start px-2.5 rounded">
                        <p>Error: {serverError}</p>
                    </div>
                )}
            </form>
        </div>
    )
}