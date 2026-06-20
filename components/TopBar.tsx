"use client";

import type { ReactNode } from "react";

interface TopBarProps {
  title?: string;
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  className?: string;
  titleClassName?: string;
}

export default function TopBar({ title, leftContent, rightContent, className = "", titleClassName = "" }: TopBarProps) {
  return (
    <header className={`flex h-[68px] w-full shrink-0 items-center justify-between bg-black px-4 ${className}`}>
      <div className="flex min-w-[24px] items-center justify-start">{leftContent}</div>

      {title && <h1 className={`text-head-18b text-white ${titleClassName}`}>{title}</h1>}

      <div className="flex min-w-[24px] items-center justify-end">{rightContent}</div>
    </header>
  );
}
