"use client";

import { UserType } from "@/lib/types";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";

type Props = {
  details: UserType;
};

export default function UpdatePersonalDetailsForm({ details }: Props) {
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
  const [error, setError] = useState<AxiosError | null>(null);

  const onSubmit = async (data: any) => {
    setError(null);
    setIsPending(true);
    axios
      .put(`/api/auth/${details._id}/update-details`, {
        data,
      })
      .then(() => {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
        }, 1500);
      })
      .catch((err: any) => {
        console.error(err.response);
        setError(err.response.data.message);
      })
      .finally(() => {
        setIsPending(false);
      });
  };

  return (
    <div className="users-container flex flex-col gap-5">
      <h4>Update Personal Details</h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="flex flex-col gap-2.5"
      >
        <div className="flex flex-col sm:grid grid-cols-2 gap-2.5">
          <div>
            <label htmlFor="firstName">
              <b>First Name</b>
            </label>
            <input
              type="text"
              className="form-input"
              defaultValue={details.firstName}
              required
              placeholder="First Name"
              id="firstName"
              {...register("firstName", {
                required: "Required",
                maxLength: {
                  value: 50,
                  message:
                    "First name cannot be longer than a fifty (50) characters long!",
                },
              })}
            />
            <span>
              <p className="text-red-600 font-bold mt-1.5 text-xs">
                {errors.firstName?.message}
              </p>
            </span>
          </div>
          <div>
            <label htmlFor="lastName">
              <b>Last Name</b>
            </label>
            <input
              type="text"
              placeholder="Last Name"
              className="form-input"
              defaultValue={details.lastName}
              id="lastName"
              required
              {...register("lastName", {
                required: "Required",
                maxLength: {
                  value: 50,
                  message:
                    "Last name cannot be longer than a fifty (50) characters long!",
                },
              })}
            />
            {errors.lastName?.message && (
              <p className="text-red-600 font-bold mt-1.5 text-xs text-right">
                {String(errors.lastName?.message)}
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-col">
          <label htmlFor="email">
            <b>Email</b>
          </label>
          <input
            type="email"
            placeholder="Email"
            className="form-input"
            defaultValue={details.email}
            required
            id="email"
            {...register("email", {
              required: "Required",
              maxLength: {
                value: 100,
                message:
                  "Email cannot be longer than a hundred (100) characters long!",
              },
            })}
          />
          {errors.email?.message && (
            <p className="text-red-600 font-bold mt-1.5 text-xs">
              {String(errors.email?.message)}
            </p>
          )}
        </div>
        {error && (
          <div className="standard-container bg-red-500">
            <p>{error.message}</p>
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
              <button className="btn submit">Save</button>
            )}
          </>
        )}
      </form>
    </div>
  );
}
