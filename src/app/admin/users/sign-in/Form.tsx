'use client'

import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

export default function Form() {
    const form = useForm();
    const { register, control, handleSubmit, formState, watch, reset, setValue, trigger } = form;
    const { errors } = formState;
    const [isPending, setIsPending] = useState(false);
    const [success, setIsSuccess] = useState(false);
    const [serverError, setServerError] = useState(null);

    const onSubmit = (data:object) => {
        setIsPending(true);
        axios.post(`/api/auth`, data)
            .then((response:any) => {
                console.log(response.data)
            }).catch((err:any) => {
                console.log(err.message);
                setServerError(err.message);
            }).finally(() => {
                setIsPending(false);
            })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <h4 className="text-center">Sign In</h4>
            <img src="/images/big-ben.svg" alt="" className="h-16"/>
            <div className="form-grid">
                <input type="email" className="form-input" placeholder="Email" 
                    {...register("email", {
                        required: "Required"
                    })}
                />
                <input type="password" className="form-input" placeholder="Password" 
                    {...register("password", {
                        required: "Required"
                    })}
                />
            </div>
            <button className="submit">Submit</button>
            <p className="text-center text-sm">Not registered? <a href="sign-up">Sign Up</a></p>
        </form>
    )
}