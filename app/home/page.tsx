import Filter from "./Filter";
import MainTopBar from "@/components/MainTopBar";
import WriteButton from "./WriteButton";
import CharacterCard from "@/components/CharacterCard";

export default function Home() {
  return (
    <>
      <div>
        <MainTopBar />
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
