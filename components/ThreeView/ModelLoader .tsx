"use client";

import { useLoader } from "@react-three/fiber";
import { RefObject, useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

interface Props {
  modelPath: string;
  originalColors: RefObject<Map<string, THREE.Color>>;
  originalPositions: RefObject<Map<string, THREE.Vector3>>;
  sceneRef: RefObject<THREE.Scene | null>;
}

export const ModelLoader = ({ modelPath, originalColors, originalPositions, sceneRef }: Props) => {
  //모델 로딩
  const { scene } = useLoader(GLTFLoader, modelPath);
  // 씬이 로드된 후에 sceneRef를 할당하기 위한 상태 관리
  const [isSceneLoaded, setIsSceneLoaded] = useState(false);

  useEffect(() => {
    if (scene && !isSceneLoaded) {
      sceneRef.current = scene;
      // 씬 내 모든 메쉬에 대해 색상과 위치 저장
      scene.traverse((obj) => {
        console.log(obj);
        if (obj.isMesh) {
          const mesh = obj as THREE.Mesh;

          // 각 mesh의 material을 클론하여 독립적으로 만들어줌
          if (Array.isArray(mesh.material)) {
            mesh.material = mesh.material.map((m) => m.clone());
          } else {
            mesh.material = mesh.material.clone();
          }

          // 원래 색상 저장
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((m) => {
              if (m instanceof THREE.MeshBasicMaterial || m instanceof THREE.MeshStandardMaterial) {
                originalColors.current.set(mesh.uuid, m.color.clone());
              }
            });
          } else {
            if (mesh.material instanceof THREE.MeshBasicMaterial || mesh.material instanceof THREE.MeshStandardMaterial) {
              originalColors.current.set(mesh.uuid, mesh.material.color.clone());
            }
          }

          originalPositions.current.set(mesh.uuid, mesh.position.clone());

          // 클릭 가능하게 만들기 위해 material 속성 설정
          (mesh.material as any).opacity = 1;
          (mesh.material as any).transparent = false;
        }
      });

      setIsSceneLoaded(true);
    }
  }, [scene, isSceneLoaded, originalColors, originalPositions, sceneRef]);

  return <primitive object={scene} scale={[5, 5, 5]} />;
};
