import X from "@/assets/icons/ic_x.svg";
import Check from "@/assets/icons/ic_check.svg";

type PasswordRuleProps = {
  touched: boolean;
  ok: boolean;
  label: string;
};

export default function PasswordRule({ touched, ok, label }: PasswordRuleProps) {
  const isError = touched && !ok;

  return (
    <li className={`text-detail-12m flex items-center gap-1.5 ${isError ? "text-red-20" : "text-blue-20"}`}>
      {ok ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
      <p>{label}</p>
    </li>
  );
}
