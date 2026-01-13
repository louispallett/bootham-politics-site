"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
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
      .then(() => {
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
        <div>
          <input
            type="text"
            className="form-input"
            placeholder="First Name"
            required
            {...register("firstName", {
              required: "Required",
            })}
          />
          {errors.firstName?.message && (
            <p className="form-error">{String(errors.firstName?.message)}</p>
          )}
        </div>
        <div>
          <input
            type="text"
            className="form-input"
            placeholder="Last Name"
            required
            {...register("lastName", {
              required: "Required",
            })}
          />
          {errors.lastName?.message && (
            <p className="form-error text-right">
              {String(errors.lastName?.message)}
            </p>
          )}
        </div>
      </div>
      <div>
        <input
          type="email"
          className="form-input"
          placeholder="Email"
          required
          {...register("email", {
            required: "Required",
          })}
        />
        {errors.email?.message && (
          <p className="form-error">{String(errors.email?.message)}</p>
        )}
      </div>
      <div className="form-grid">
        <div>
          <input
            type="password"
            className="form-input"
            placeholder="Password"
            required
            {...register("password", {
              required: "Required",
            })}
          />
          {errors.password?.message && (
            <p className="form-error">{String(errors.password?.message)}</p>
          )}
        </div>
        <div>
          <input
            type="password"
            className="form-input"
            placeholder="Confirm Password"
            required
            {...register("confPassword", {
              required: "Required",
              validate: {
                passwordMatch: (fieldValue) => {
                  return (
                    fieldValue == watch("password") || "Passwords do not match"
                  );
                },
              },
            })}
          />
          {errors.confPassword?.message && (
            <p className="form-error text-right">
              {String(errors.confPassword?.message)}
            </p>
          )}
        </div>
      </div>
      <div>
        <input
          type="password"
          className="form-input"
          placeholder="Pass Key"
          required
          {...register("passkey", {
            required: "Required",
          })}
        />
        {errors.passkey?.message && (
          <p className="form-error">{String(errors.passkey?.message)}</p>
        )}
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
