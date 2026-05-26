import AlarmDefault from "@/assets/icons/ic_alarm_default.svg";
import Menu from "@/assets/icons/ic_menu.svg";

import Filter from "./Filter";
import WriteButton from "./WriteButton";
import CharacterCard from "@/components/CharacterCard";

export default function Home() {
  return (
    <>
      <div>
        <div className="sticky top-0 z-10 flex h-17 items-center justify-between bg-black px-4">
          <p className="text-head-22sb">서비스 로고</p>

          <div className="align-center flex gap-4">
            <button type="button">
              <AlarmDefault className="h-6 w-6 flex-none text-gray-50" />
            </button>
            <button type="button">
              <Menu className="h-6 w-6 flex-none text-gray-50" />
            </button>
          </div>
        </div>

        <Filter />
      </div>

      <ul className="flex flex-col gap-4 px-4">
        <CharacterCard type="anxious" />
        <CharacterCard type="helpless" />
        <CharacterCard type="lonely" />
        <CharacterCard type="selfHate" />
        <CharacterCard type="annoyed" />
      </ul>

      <WriteButton />
    </>
  );
}
