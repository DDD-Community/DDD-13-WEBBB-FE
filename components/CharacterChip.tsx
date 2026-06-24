import { CHARACTER_LABEL } from "@/const/map";
import { type EmotionType } from "@/services/types";
import { cva } from "class-variance-authority";

const characterLabelStyle: (props: { character: EmotionType }) => string = cva(
  "text-detail-13sb w-fit rounded-sm px-2 py-1",
  {
    variants: {
      character: {
        LETHARGY: "bg-purple-10 text-purple-20",
        ANXIETY: "bg-orange-10 text-orange-20",
        LONELINESS: "bg-blue-10 text-blue-20",
        SELF_DEPRECATION: "bg-green-10 text-green-20",
        IRRITATION: "bg-red-10 text-red-20",
      },
    },
  }
);

type CharacterChipProps = {
  type: EmotionType;
};

export default function CharacterChip({ type }: CharacterChipProps) {
  const characterLabel = CHARACTER_LABEL[type];

  return <div className={characterLabelStyle({ character: type })}>{characterLabel} 몬스터</div>;
}
