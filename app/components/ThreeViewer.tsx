"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function ThreeViewer() {
  const mountRef = useRef<HTMLDivElement>(null);

  const droneRef = useRef<THREE.Object3D | null>(null);
  const originalPositions = useRef<Map<string, THREE.Vector3>>(new Map());

  useEffect(() => {
    if (!mountRef.current) return;

    /* 씬 */
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    /* 카메라 */
    const camera = new THREE.PerspectiveCamera(
      20,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      100
    );
    camera.position.set(3, 2.5, 3);
    camera.lookAt(0, 0, 0);

    /* 렌더러 */
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true, // 나중에 PNG 저장 가능.
    });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mountRef.current.appendChild(renderer.domElement);

    /* 조명 */
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(5, 6, 5);
    scene.add(dirLight);

    /* 컨트롤 영역 */
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enableZoom = true;
    controls.zoomSpeed = 1.0;
    controls.minDistance = 2; // 너무 가까이 못 가게
    controls.maxDistance = 12; // 너무 멀리 못 가게
    /* glb 로드 영역 */
    const loader = new GLTFLoader();

    loader.load("/models/Drone.glb", (gltf) => {
      const drone = gltf.scene;
      drone.scale.setScalar(5);

      scene.add(drone);
      droneRef.current = drone;

      //  원래 위치 저장하는 로직
      drone.traverse((obj) => {
        if (obj.isMesh) {
          originalPositions.current.set(obj.uuid, obj.position.clone());
        }
      });

      controls.target.copy(drone.position);
      controls.update();
    });

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    /* ReSize */
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect =
        mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(
        mountRef.current.clientWidth,
        mountRef.current.clientHeight
      );
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  /* 분해  */
  const applyExplode = (value: number) => {
    const drone = droneRef.current;
    if (!drone) return;

    drone.traverse((obj) => {
      if (!obj.isMesh) return;

      const origin = originalPositions.current.get(obj.uuid);
      if (!origin) return;

      const dir = origin.clone().normalize();

      //방향 없는 것들
      if (dir.length() === 0) {
        dir.set(0, 0.5, 0); // 위로 분해
      }
      // 중심을 기반으로 하여 분해
      obj.position.copy(origin.clone().add(dir.multiplyScalar(value * 0.3)));

      // y 축으로 분해
      // obj.position.copy(
      //   origin.clone().add(
      //     new THREE.Vector3(0, value * 0.3, 0)
      //   )
      // );
    });
  };

  return (
    <div className="w-full h-full relative">
      <div ref={mountRef} className="w-full h-full" />

      {/*분해 및 조합  range*/}
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
    </div>
  );
}
