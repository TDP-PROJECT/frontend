"use client"

import { useState } from "react";
import ThreeViewer from "../../components/ThreeViewer";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import SelectBox from "@/components/SelectBox";
import { PartListMock } from "@/constant";



export default function ViewerPage() {
  const [selectedMesh, setSelectedMesh] = useState(null);
  const searchParams = useSearchParams();
  const name = searchParams.get('name');
  const [isMenu, setIsMenu] = useState(false);

  const handleMeshSelect = (meshData: any) => {
    setSelectedMesh(meshData);
  };

  return (
    <div className="flex w-screen h-screen px-2">
      <div>
        <div className="w-96 h-20 shadow-lg flex justify-between items-center px-2">
          <p className="font-medium">{name}</p>
          <Image className="cursor-pointer" onClick={() => setIsMenu(!isMenu)} src={`/icons/${isMenu ? 'Up' : 'Down'}.svg`} alt="아이콘" width={20} height={20} />
        </div>
        <div
          className={`transition-transform duration-500 ease-in-out overflow-hidden ${isMenu ? 'max-h-screen transform translate-y-5' : 'max-h-0 transform translate-y-0'
            }`}
        >
          <SelectBox partList={PartListMock} />
        </div>

      </div>
      <div className="flex-1">
        {/* <ThreeViewer onMeshSelect={handleMeshSelect} /> */}
      </div>

    </div>
  )
}