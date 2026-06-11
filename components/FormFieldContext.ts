import { createContext } from "react";

type FormFieldContextValue = {
  inputId?: string;
  errorId?: string;
  invalid?: boolean;
};

export const FormFieldContext = createContext<FormFieldContextValue | null>(null);
