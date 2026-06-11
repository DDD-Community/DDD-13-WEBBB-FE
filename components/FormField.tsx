"use client";

import { type ReactNode } from "react";
import { useFormContext } from "react-hook-form";
import { FormFieldContext } from "./FormFieldContext";

type FormFieldProps = {
  label?: string;
  name?: string;
  htmlFor?: string; // name과 DOM id가 달라야 할 때만 지정. 생략 시 name을 id로 사용
  hideLabel?: boolean;
  children: ReactNode;
};

export default function FormField({ label, name, htmlFor, hideLabel, children }: FormFieldProps) {
  const { getFieldState, formState } = useFormContext();

  const error = name ? getFieldState(name, formState).error : undefined;
  const inputId = htmlFor ?? name;
  const errorId = `${inputId}-error`;

  return (
    <div>
      {!hideLabel && (
        <label htmlFor={inputId} className="text-body-16sb mb-3 block">
          {label}
        </label>
      )}

      <FormFieldContext.Provider value={{ inputId, errorId, invalid: !!error }}>{children}</FormFieldContext.Provider>

      {error?.message && (
        <p id={errorId} role="alert" className="text-red-20 text-detail-12m mt-3">
          {error.message}
        </p>
      )}
    </div>
  );
}
