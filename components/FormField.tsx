"use client";

import { type ReactNode } from "react";

type FormFieldProps = {
  label: string;
  htmlFor: string;
  errorMessage?: string;
  children: ReactNode;
};

export default function FormField({ label, htmlFor, errorMessage, children }: FormFieldProps) {
  const errorId = `${htmlFor}-error`;

  return (
    <div>
      <label htmlFor={htmlFor} className="text-body-16sb mb-3 block">
        {label}
      </label>

      {children}

      {errorMessage && (
        <p id={errorId} role="alert" className="text-red-20 text-detail-12m mt-3">
          {errorMessage}
        </p>
      )}
    </div>
  );
}
