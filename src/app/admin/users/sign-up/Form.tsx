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
        axios.post(`/api/auth/register`, data)
            .then((response:object) => {
                setIsSuccess(true);
            }).catch((err:any) => {
                console.log(err.message);
                setServerError(err.message);
            }).finally(() => {
                setIsPending(false);
            })
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <h4 className="text-center">Sign Up</h4>
            <img src="/images/big-ben.svg" alt="" className="h-16"/>
            <div className="form-grid">
                <input type="text" className="form-input" placeholder="First Name" required
                    {...register("firstName", {
                        required: "Required"
                    })}
                />
                <input type="text" className="form-input" placeholder="Last Name" required
                    {...register("lastName", {
                        required: "Required"
                    })}
                />
            </div>
            <div className="form-grid">
                <input type="email" className="form-input" placeholder="Email" required 
                    {...register("email", {
                        required: "Required"
                    })}
                />
                <input type="password" className="form-input" placeholder="Password" required 
                    {...register("password", {
                        required: "Required"
                    })}
                />
            </div>
            <input type="password" className="form-input" placeholder="Pass Key" required 
                {...register("passkey", {
                    required: "Required"
                })}
            />
            <button className="submit">Submit</button>
            <p className="text-center text-sm">Already have an account? <a href="sign-in">Sign in</a></p>
        </form>
    )
}