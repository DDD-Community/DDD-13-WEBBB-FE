"use client";

import React, { useState, useRef } from "react";
import type { SupportType } from "./mockData";

interface CommentInputProps {
  placeholderType: SupportType;
}

export default function CommentInput({ placeholderType }: CommentInputProps) {
  const [commentText, setCommentText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  return (
    <div className="bg-gray-90 fixed bottom-0 left-1/2 flex w-full max-w-2xl -translate-x-1/2 flex-col gap-2.5 px-4 pt-3 pb-[24px]">
      <textarea
        ref={textareaRef}
        value={commentText}
        onChange={handleTextareaChange}
        placeholder={`${placeholderType}...`}
        rows={1}
        className="text-body-15m max-h-[115px] w-full resize-none overflow-y-auto bg-transparent text-white outline-none placeholder:text-gray-50"
      />
      <div className="flex w-full justify-end">
        <button
          type="button"
          className={`flex h-[32px] w-[52px] shrink-0 items-center justify-center rounded-[4px] text-center transition-colors ${
            commentText.trim().length > 0 ? "bg-blue-30 text-white" : "bg-gray-80 text-gray-40"
          }`}
        >
          <span className="text-body-14m">댓글</span>
        </button>
      </div>
    </div>
  );
}
