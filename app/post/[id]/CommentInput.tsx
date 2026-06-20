"use client";

import React, { useState, useRef } from "react";

interface CommentInputProps {
  placeholderType: string;
  onSubmit: (content: string) => Promise<void>;
  isSubmitting?: boolean;
}

export default function CommentInput({ placeholderType, onSubmit, isSubmitting = false }: CommentInputProps) {
  const [commentText, setCommentText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCommentText(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleCancel = () => {
    setCommentText("");
    setIsFocused(false);
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (e.currentTarget.contains(e.relatedTarget as Node)) {
      return;
    }
    handleCancel();
  };

  const handleSubmit = async () => {
    const content = commentText.trim();
    if (content.length === 0 || isSubmitting) return;

    try {
      await onSubmit(content);
      handleCancel();
    } catch {
      // 에러 처리는 상위 mutation onError 에서 수행
    }
  };

  return (
    <div
      onBlur={handleBlur}
      className={`bg-gray-90 fixed bottom-0 left-1/2 flex w-full max-w-2xl -translate-x-1/2 px-4 pb-[24px] ${
        isFocused ? "flex-col gap-2.5 pt-3" : "h-[72px] flex-row items-start justify-between pt-[16px]"
      }`}
    >
      <textarea
        ref={textareaRef}
        value={commentText}
        onChange={handleTextareaChange}
        onFocus={() => setIsFocused(true)}
        placeholder={`${placeholderType}...`}
        rows={1}
        className={`text-body-15m max-h-[115px] resize-none overflow-y-auto bg-transparent text-white outline-none placeholder:text-gray-50 ${
          isFocused ? "w-full" : "w-[calc(100%-60px)]"
        }`}
      />

      <div className={`flex shrink-0 items-center ${isFocused ? "w-full justify-end gap-2" : ""}`}>
        {isFocused && (
          <button
            type="button"
            onClick={handleCancel}
            className="text-gray-40 text-body-14m flex h-[32px] w-[52px] shrink-0 items-center justify-center rounded-[4px] text-center"
          >
            취소
          </button>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={commentText.trim().length === 0 || isSubmitting}
          className={`flex h-[32px] w-[52px] shrink-0 items-center justify-center rounded-[4px] text-center transition-colors ${
            commentText.trim().length > 0 && !isSubmitting ? "bg-blue-30 text-white" : "bg-gray-80 text-gray-40"
          }`}
        >
          <span className="text-body-14m">댓글</span>
        </button>
      </div>
    </div>
  );
}
