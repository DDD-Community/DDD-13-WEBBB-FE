"use client";

import { useRouter } from "next/navigation";
import Modal from "./modal";

interface LoginRequiredModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginRequiredModal({ isOpen, onClose }: LoginRequiredModalProps) {
  const router = useRouter();

  function handleConfirm() {
    onClose();
    router.push("/login");
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleConfirm}
      title={"로그인이 필요한 기능이에요.\n로그인 하시겠어요? "}
      confirmText="확인"
      cancelText="취소"
      confirmVariant="blue"
    />
  );
}
