"use client";

import ArrowDown from "@/assets/icons/ic_arrow_down.svg";
import Check from "@/assets/icons/ic_check.svg";

type InlineSelectProps = {
  id: string;
  label: string;
  value: string;
  options: readonly string[];
  isOpen: boolean;
  onToggle: () => void;
  onChange: (value: string) => void;
};

export default function InlineSelect({ id, label, value, options, isOpen, onToggle, onChange }: InlineSelectProps) {
  const optionsId = `${id}-options`;

  return (
    <div className="bg-gray-90 flex w-full flex-col rounded-xl px-5 py-4 text-left transition-all">
      <button
        type="button"
        id={id}
        aria-expanded={isOpen}
        aria-controls={optionsId}
        onClick={onToggle}
        className="flex w-full items-center justify-between"
      >
        <p className="text-head-18sb">{value}</p>
        <ArrowDown
          className={`h-4 w-4 flex-none text-gray-50 transition-transform ${isOpen ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <>
          <div className="bg-gray-80 my-4 h-[1px]" />

          <fieldset id={optionsId} aria-labelledby={`${id}-legend`} className="w-full">
            <legend id={`${id}-legend`} className="sr-only">
              {label}
            </legend>

            <div className="grid grid-cols-2 gap-5">
              {options.map((option) => {
                const isSelected = option === value;

                return (
                  <label
                    key={option}
                    className={`${isSelected ? "text-head-18b" : "text-head-18m"} text-gray-60 has-checked:text-blue-20 flex cursor-pointer items-center justify-between`}
                  >
                    <span>{option}</span>
                    <input
                      type="radio"
                      name={id}
                      value={option}
                      checked={isSelected}
                      onChange={() => onChange(option)}
                      className="sr-only"
                    />
                    {isSelected && <Check className="text-blue-20 h-6.5 w-6.5 flex-none" aria-hidden="true" />}
                  </label>
                );
              })}
            </div>
          </fieldset>
        </>
      )}
    </div>
  );
}
