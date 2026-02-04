import { IPart } from "@/types";
import PartList from "./PartList";

interface Props {
  partList: IPart[]
}


export default function SelectBox({ partList }: Props) {
  return (
    <div className="w-96 bg-[#4D4D4D] rounded-xl h-88 p-6">
      <PartList partList={partList} />
    </div>
  )
}