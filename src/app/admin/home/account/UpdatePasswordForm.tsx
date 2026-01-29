"use client";

import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";
import { HttpError } from "@/lib/types";

export default function UpdatePasswordForm() {
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
  const [isPending, setIsPending] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [serverError, setServerError] = useState<HttpError | null>(null);

  const onSubmit = async (data: any) => {
    setServerError(null);
    setIsPending(true);
    axios
      .put(`/api/auth/update/password`, data)
      .then(() => {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 1500);
        reset();
      })
      .catch((err: AxiosError) => {
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
    <div className="users-container flex flex-col gap-5">
      <h4>Update Password</h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-2.5"
      >
        <div className="flex flex-col sm:grid grid-cols-2 gap-2.5">
          <div>
            <input
              type={showPassword ? "text" : "password"}
              id="currentPassword"
              autoComplete="current-password"
              required
              placeholder="Current Password"
              {...register("currentPassword", {
                required: "Required",
              })}
              className="form-input"
            />
            {errors.currentPassword?.message && (
              <p className="form-error">
                {String(errors.currentPassword.message)}
              </p>
            )}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                className="form-input"
                required
                placeholder="New Password"
                {...register("newPassword", {
                  required: "Required",
                  minLength: {
                    value: 8,
                    message:
                      "Password must be at least eight (8) characters long",
                  },
                  pattern: {
                    value:
                      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d])[A-Za-z\d\S]{8,}$/,
                    message:
                      "Must contain: uppercase, lowercase, number, and special character",
                  },
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
            {errors.newPassword?.message && (
              <p className="form-error text-right">
                {String(errors.newPassword?.message)}
              </p>
            )}
          </div>
        </div>
        {serverError && (
          <div className="standard-container bg-red-500">
            <b>Error ({serverError.status})</b>: {serverError.message}
          </div>
        )}
        {isPending ? (
          <div className="submit flex justify-center">
            <div className="spinner h-6 w-6"></div>
          </div>
        ) : (
          <>
            {success ? (
              <div className="success flex justify-center">
                <p>Success!</p>
              </div>
            ) : (
              <button className="btn submit">Update Password</button>
            )}
          </>
        )}
      </form>
    </div>
  );
}
