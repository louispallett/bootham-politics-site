"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
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
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const onSubmit = (data: object) => {
    setServerError(null);
    setIsPending(true);
    axios
      .post(`/api/auth`, data)
      .then(() => {
        window.location.assign("/admin/home");
      })
      .catch((err: any) => {
        console.error(err.response);
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
      })
      .finally(() => {
        setIsPending(false);
      });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <h4 className="text-center">Sign In</h4>
      <img src="/images/big-ben.svg" alt="" className="h-16" />
      <div className="form-grid">
        <div>
          <input
            type="email"
            className="form-input"
            placeholder="Email"
            {...register("email", {
              required: "Required",
            })}
          />
          {errors.email?.message && (
            <p className="form-error">{String(errors.email?.message)}</p>
          )}
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="form-input"
              placeholder="Password"
              {...register("password", {
                required: "Required",
              })}
            />
            {showPassword ? (
              <EyeIcon
                onClick={() => setShowPassword(false)}
                className="w-6 h-6 cursor-pointer hover:opacity-50"
              />
            ) : (
              <EyeSlashIcon
                onClick={() => setShowPassword(true)}
                className="w-6 h-6 cursor-pointer hover:opacity-50"
              />
            )}
          </div>
          {errors.password?.message && (
            <p className="form-error">{String(errors.password?.message)}</p>
          )}
        </div>
      </div>
      {serverError && (
        <div className="standard-container bg-red-500">
          <p>
            <b>Error ({serverError.status})</b>: {serverError.message}
          </p>
        </div>
      )}
      <button className="btn submit">
        {isPending ? <div className="spinner h-6 w-6"></div> : <>Submit</>}
      </button>
    </form>
  );
}
