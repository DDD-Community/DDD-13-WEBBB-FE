"use client";

import Check from "@/assets/icons/ic_check.svg";
import { useFormContext } from "react-hook-form";

type OptionGridProps = {
  name: string;
  options: readonly string[];
  legend: string;
};

export default function OptionGrid({ name, options, legend }: OptionGridProps) {
  const { register } = useFormContext();

  return (
    <fieldset>
      <legend className="sr-only">{legend}</legend>

      <div className="grid grid-cols-2 gap-3">
        {options.map((option) => (
          <label
            key={option}
            className="text-head-18m has-checked:border-blue-20 has-checked:bg-blue-10 has-checked:text-blue-20 has-checked:text-head-18b border-gray-90 text-gray-60 flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3"
          >
            <input type="radio" value={option} className="peer sr-only" {...register(name)} />
            <span>{option}</span>
            <Check className="text-blue-20 invisible h-5 w-5 peer-checked:visible" aria-hidden="true" />
          </label>
        ))}
      </div>
    </fieldset>
  );
}
