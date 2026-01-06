"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import axios, { AxiosError, AxiosResponse } from "axios";
import { HttpError } from "@/lib/types";

export default function Form() {
  const form = useForm();
  const {
    register,
    control,
    handleSubmit,
    formState,
    watch,
    reset,
    setValue,
    trigger,
  } = form;
  const { errors } = formState;
  const [isPending, setIsPending] = useState(false);
  const [serverError, setServerError] = useState<HttpError | null>(null);

  const handleServerError = (err: AxiosError) => {
    console.error(err);
    if (axios.isAxiosError<HttpError>(err)) {
      setServerError({
        message: err.response?.data?.message ?? "Unknown",
        status: err.response?.status,
      });
    } else {
      setServerError({
        message: "Unexpected Error",
        status: 500,
      });
    }
  };

  const onSubmit = (data: object) => {
    setServerError(null);
    setIsPending(true);
    axios
      .post(`/api/auth/register`, data)
      .then((response: AxiosResponse) => {
        axios
          .post("/api/auth", data)
          .then(() => {
            window.location.assign("/admin/home");
          })
          .catch((err: AxiosError) => {
            handleServerError(err);
          });
      })
      .catch((err: AxiosError) => {
        handleServerError(err);
      })
      .finally(() => {
        setIsPending(false);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <h4 className="text-center">Sign Up</h4>
      <img src="/images/big-ben.svg" alt="" className="h-16" />
      <div className="form-grid">
        <input
          type="text"
          className="form-input"
          placeholder="First Name"
          required
          {...register("firstName", {
            required: "Required",
          })}
        />
        <input
          type="text"
          className="form-input"
          placeholder="Last Name"
          required
          {...register("lastName", {
            required: "Required",
          })}
        />
      </div>
      <div className="form-grid">
        <input
          type="email"
          className="form-input"
          placeholder="Email"
          required
          {...register("email", {
            required: "Required",
          })}
        />
        <input
          type="password"
          className="form-input"
          placeholder="Password"
          required
          {...register("password", {
            required: "Required",
          })}
        />
      </div>
      <input
        type="password"
        className="form-input"
        placeholder="Pass Key"
        required
        {...register("passkey", {
          required: "Required",
        })}
      />
      <button className="btn submit">Submit</button>
      <p className="text-center text-sm">
        Already have an account? <a href="sign-in">Sign in</a>
      </p>
    </form>
  );
}
