"use client";

import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useGLTF } from "@react-three/drei";

type Props = {
  modelPath: string;
  explode: number;
  selectedUuid: string | null;
  setSelectedUuid: (uuid: string | null) => void;
  originalColors: React.MutableRefObject<Map<string, THREE.Color>>;
  originalPositions: React.MutableRefObject<Map<string, THREE.Vector3>>;
};

export function Model({
  modelPath,
  explode,
  selectedUuid,
  setSelectedUuid,
  originalColors,
  originalPositions,
}: Props) {
  const gltf = useGLTF(modelPath);
  const root = gltf.scene;

  // 메쉬 목록 캐시 (explode 적용용)
  const meshes = useMemo(() => {
    const list: THREE.Mesh[] = [];
    root.traverse((o) => {
      if ((o as any).isMesh) list.push(o as THREE.Mesh);
    });
    return list;
  }, [root]);

  // 최초 1회: material clone + 원래 색/위치 저장
  const inited = useRef(false);
  useEffect(() => {
    if (inited.current) return;
    inited.current = true;

    for (const mesh of meshes) {
      // material을 독립적으로 (색 바꿔도 공유 안 하게)
      if (Array.isArray(mesh.material)) {
        mesh.material = mesh.material.map((m) => m.clone());
      } else {
        mesh.material = mesh.material.clone();
      }

      // 원래 색상 저장 (MeshStandard/Basic만 대상으로)
      const saveColor = (m: THREE.Material) => {
        const mm = m as any;
        if (mm?.color?.isColor) {
          originalColors.current.set(mesh.uuid, mm.color.clone());
        }
      };

      if (Array.isArray(mesh.material)) mesh.material.forEach(saveColor);
      else saveColor(mesh.material);

      // 원래 위치 저장
      originalPositions.current.set(mesh.uuid, mesh.position.clone());
    }
  }, [meshes, originalColors, originalPositions]);

  // explode 적용 + 선택 하이라이트/복원
  useEffect(() => {
    for (const mesh of meshes) {
      // 1) explode: 원래 위치 기준으로 이동
      const base = originalPositions.current.get(mesh.uuid);
      if (base) {
        const dir = base.clone().normalize();
        if (dir.lengthSq() === 0) dir.set(0, 1, 0);
        mesh.position.copy(base.clone().add(dir.multiplyScalar(explode * 0.3)));
      }

      // 2) 색상: 선택된 메쉬만 빨간색, 나머지는 원래 색
      const applyColor = (m: THREE.Material, color: THREE.Color) => {
        const mm = m as any;
        if (mm?.color?.isColor) mm.color.copy(color);
      };

      const orig = originalColors.current.get(mesh.uuid);
      if (!orig) continue;

      const target = mesh.uuid === selectedUuid ? new THREE.Color(0xff0000) : orig;

      if (Array.isArray(mesh.material)) mesh.material.forEach((m) => applyColor(m, target));
      else applyColor(mesh.material, target);
    }
  }, [explode, selectedUuid, meshes, originalPositions, originalColors]);

  return (
    <primitive
      object={root}
      scale={[5, 5, 5]}
      // R3F가 raycast + 이벤트를 다 해줍니다.
      onPointerDown={(e) => {
        e.stopPropagation(); // 뒤로 이벤트 전파 막기 (중요)
        const mesh = e.object as THREE.Mesh;
        setSelectedUuid(mesh.uuid);
      }}
    />
  );
}
