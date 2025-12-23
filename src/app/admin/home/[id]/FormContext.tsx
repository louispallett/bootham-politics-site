"use client";

import { HttpError } from "@/lib/types";
import { createContext, useContext } from "react";

type FormContextType = {
  isPending: boolean;
  setIsPending: (v: boolean) => void;
  serverError: HttpError | null;
  setServerError: (v: HttpError | null) => void;
};

export const FormContext = createContext<FormContextType | null>(null);

export function useFormContext() {
  const ctx = useContext(FormContext);
  if (!ctx) {
    throw new Error("useFormContext must be used within FormContext.Provider");
  }
  return ctx;
}
