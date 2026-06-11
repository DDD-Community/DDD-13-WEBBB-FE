"use client";

import type { ReactNode } from "react";

interface TopBarProps {
  title?: string;
  leftContent?: ReactNode;
  rightContent?: ReactNode;
}

export default function TopBar({ title, leftContent, rightContent }: TopBarProps) {
  return (
    <header className="flex h-[68px] w-full shrink-0 items-center justify-between bg-black px-4">
      <div className="flex min-w-[24px] items-center justify-start">{leftContent}</div>

      {title && <h1 className="text-head-18b leading-[150%] tracking-[-0.36px] text-white">{title}</h1>}

      <div className="flex min-w-[24px] items-center justify-end">{rightContent}</div>
    </header>
  );
}
