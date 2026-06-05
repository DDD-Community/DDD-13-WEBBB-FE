import {
  autoUpdate,
  flip,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating as useFloatingUI,
  useInteractions,
  type Placement,
} from "@floating-ui/react";
import { useState } from "react";

type UseFloatingOptions = {
  placement?: Placement;
  gap?: number; // px
};

export default function useFloating({ placement = "bottom-end", gap = 8 }: UseFloatingOptions = {}) {
  const [isOpen, setIsOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloatingUI({
    open: isOpen,
    onOpenChange: setIsOpen,
    placement,
    middleware: [offset(gap), flip(), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  // MEMO: refs.xxx를 JSX에서 직접 접근하면 react-hooks/refs에 걸려서 콜백 ref를 미리 꺼내둠
  const { setReference, setFloating } = refs;

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss]);

  return {
    isOpen,
    setIsOpen,
    setReference,
    setFloating,
    floatingStyles,
    getReferenceProps,
    getFloatingProps,
  };
}
