"use client"

import { useState } from "react";
import ThreeViewer from "../../components/ThreeViewer";
import { useSearchParams } from "next/navigation";
import Image from "next/image";

export default function ViewerPage() {
  const [selectedMesh, setSelectedMesh] = useState(null);
  const searchParams = useSearchParams();
  const name = searchParams.get('name');
  const [isMenu, setIsMenu] = useState(false);

  const handleMeshSelect = (meshData: any) => {
    setSelectedMesh(meshData);
  };
  console.log(isMenu)
  return (
    <div className="flex w-screen h-screen px-2">
      <div>
        <div className="w-96 h-20 shadow-lg flex justify-between items-center px-2">
          <p className="font-medium">{name}</p>
          <Image className="cursor-pointer" onClick={() => setIsMenu(!isMenu)} src={`/icons/${isMenu ? 'Up' : 'Down'}.svg`} alt="아이콘" width={20} height={20} />
        </div>
        <div className="w-96 bg-[#4D4D4D] rounded-xl h-88 p-4">
          <div className="flex justify-between items-center ">
            <p className="text-[#A6A6A6]">로봇팔</p>
            <Image className="text-white" src={"/icons/Dropdown.svg"} alt="상세보기" width={20} height={20} />
          </div>
        </div>
      </div>
      <div className="flex-1">
        {/* <ThreeViewer onMeshSelect={handleMeshSelect} /> */}
      </div>

    </div>
  )
}