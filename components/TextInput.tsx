"use client";

import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  hasError?: boolean;
  rightSlot?: ReactNode;
};

const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { hasError = false, rightSlot, className, ...inputProps },
  ref
) {
  return (
    <div
      data-invalid={hasError || undefined}
      className="data-invalid:border-red-20 bg-gray-90 flex items-center gap-3 rounded-xl border border-transparent pr-3"
    >
      <input
        ref={ref}
        aria-invalid={hasError || undefined}
        className={`text-head-18m placeholder:text-gray-60 min-w-0 flex-1 rounded-xl py-3.5 pl-5 outline-none ${className ?? ""}`}
        {...inputProps}
      />

      {rightSlot}
    </div>
  );
});

export default TextInput;
