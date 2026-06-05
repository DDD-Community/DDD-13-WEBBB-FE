"use client";

import { useSyncExternalStore, type ReactNode } from "react";
import { createPortal } from "react-dom";

const subscribe = () => () => {};

function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}

export default function Portal({ children }: { children: ReactNode }) {
  const mounted = useMounted();

  if (!mounted) return null;

  return createPortal(children, document.body);
}
