"use client";

import { forwardRef, useContext, type InputHTMLAttributes, type ReactNode } from "react";
import { FormFieldContext } from "./FormFieldContext";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean;
  rightSlot?: ReactNode;
};

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { hasError, rightSlot, className, ...inputProps },
  ref
) {
  const ctx = useContext(FormFieldContext);

  const resolvedHasError = hasError ?? ctx?.invalid ?? false;

  return (
    <div
      data-invalid={resolvedHasError || undefined}
      className="data-invalid:border-red-20 bg-gray-90 focus-within:border-blue-20 flex items-center gap-3 rounded-xl border border-transparent pr-3"
    >
      <input
        ref={ref}
        id={ctx?.inputId}
        aria-describedby={ctx?.invalid ? ctx.errorId : undefined}
        aria-invalid={resolvedHasError || undefined}
        className={`text-head-18m placeholder:text-gray-60 min-w-0 flex-1 rounded-xl py-3.5 pl-5 outline-none ${className ?? ""}`}
        {...inputProps}
      />

      {rightSlot}
    </div>
  );
});

export default TextInput;
