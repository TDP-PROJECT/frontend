"use client";

import { Canvas } from "@react-three/fiber";
import { useState, useRef } from "react";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { ModelLoader } from "./ModelLoader ";


export default function ThreeView() {
  const [modelPath, setModelPath] = useState("/models/Engine2.glb"); // 기본 모델 경로
  const [selectedMesh, setSelectedMesh] = useState<THREE.Mesh | null>(null); // 선택된 메쉬 관리
  const originalPositions = useRef<Map<string, THREE.Vector3>>(new Map());
  const originalColors = useRef<Map<string, THREE.Color>>(new Map());
  const sceneRef = useRef<THREE.Scene | null>(null);

  const applyExplode = (value: number) => {
    if (!sceneRef.current) {
      console.log("Scene not yet loaded");
      return;
    }


    // 씬 내 모든 객체에 대해 원래 위치를 기반으로 분해 효과 적용
    originalPositions.current.forEach((position, uuid) => {
      // getObjectByProperty는 씬의 객체에서 특정 속성으로 찾는 메서드
      const mesh = sceneRef.current.getObjectByProperty("uuid", uuid) as THREE.Mesh;
      if (!mesh) return;

      // 분해 방향 설정
      const dir = position.clone().normalize();
      if (dir.length() === 0) dir.set(0, 0.5, 0); // 방향이 없으면 위로 설정

      // 위치를 원래 위치에서 방향으로 이동
      mesh.position.copy(position.clone().add(dir.multiplyScalar(value * 0.3)));
    });
  };

  // 클릭 시 색상 변경 및 메쉬 선택
  const handleMeshClick = (mesh: THREE.Mesh) => {
    setSelectedMesh(mesh);

    // 색상 변경 (빨간색)
    if (mesh.material instanceof THREE.MeshStandardMaterial) {
      mesh.material.color.set(0xff0000);
    }
  };

  return (
    <>
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 6, 5]} intensity={1.2} />
        <OrbitControls />
        <ModelLoader modelPath={modelPath} originalColors={originalColors}
          originalPositions={originalPositions} sceneRef={sceneRef} />
      </Canvas>

      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        defaultValue={0}
        onChange={(e) => applyExplode(Number(e.target.value))}
        style={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          width: "300px",
        }}
      />
    </>
  );
}
