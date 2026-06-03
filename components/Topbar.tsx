"use client";

import type { ReactNode } from "react";

interface TopbarProps {
  title?: string;
  leftContent?: ReactNode;
  rightContent?: ReactNode;
}

export default function Topbar({ title, leftContent, rightContent }: TopbarProps) {
  return (
    <header className="flex h-[68px] w-[375px] shrink-0 items-center justify-between bg-black px-4">
      <div className="flex min-w-[24px] items-center justify-start">{leftContent}</div>

      {title && <h1 className="text-head-18b leading-[150%] tracking-[-0.36px] text-white">{title}</h1>}

      <div className="flex min-w-[24px] items-center justify-end">{rightContent}</div>
    </header>
  );
}
