import { IPart } from "@/types";
import Image from "next/image";

interface Props {
  partList: IPart[]
}

export default function PartList({ partList }: Props) {

  return (
    <div className="flex flex-col gap-4">
      {partList.map((part, idx) =>
        <div className="flex justify-between items-center " key={idx} >
          <p className="text-[#A6A6A6]">{part.name}</p>
          <Image className="text-white cursor-pointer" src={"/icons/Dropdown.svg"} alt="상세보기" width={20} height={20} />
        </div>)}
    </div>
  )
}