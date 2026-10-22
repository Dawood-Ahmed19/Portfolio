"use client";

import { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import * as THREE from "three";

function Robot() {
  const { scene } = useGLTF("/models/cartoon_robot.glb");
  const group = useRef<THREE.Group>(null);
  const head = useRef<THREE.Object3D | null>(null);
  const eyes = useRef<THREE.Object3D[]>([]);
  const mouse = useRef({ x: 0, y: 0 });

  useEffect(() => {
    let foundHead: THREE.Object3D | null = null;
    const foundEyes: THREE.Object3D[] = [];

    scene.traverse((o) => {
      if (/background|backdrop|plane|floor|ground|bg/i.test(o.name)) {
        o.visible = false;
      }
      if (!foundHead && /head/i.test(o.name)) foundHead = o;
      if (/eye/i.test(o.name) && !/brow|lash/i.test(o.name)) foundEyes.push(o);
    });

    head.current = foundHead;
    eyes.current = foundEyes;
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove);
    return () => window.removeEventListener("pointermove", onMove);
  }, [scene]);

  useFrame(() => {
    const { x, y } = mouse.current;
    const lerp = THREE.MathUtils.lerp;

    if (group.current) {
      group.current.rotation.y = lerp(group.current.rotation.y, x * 0.5, 0.08);
      group.current.rotation.x = lerp(group.current.rotation.x, y * 0.2, 0.08);
    }

    if (head.current) {
      head.current.rotation.y = lerp(head.current.rotation.y, x * 0.3, 0.1);
      head.current.rotation.x = lerp(head.current.rotation.x, y * 0.2, 0.1);
    }
    eyes.current.forEach((eye) => {
      eye.rotation.y = lerp(eye.rotation.y, x * 0.5, 0.12);
      eye.rotation.x = lerp(eye.rotation.x, y * 0.3, 0.12);
    });
  });

  return (
    <group ref={group}>
      <primitive object={scene} />
    </group>
  );
}
export default function RobotCanvas() {
  return (
    <div className="mx-auto my-4 aspect-square w-full max-w-[240px]">
      <Canvas camera={{ position: [0, 0.5, 4], fov: 35 }} dpr={[1, 2]}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[3, 4, 5]} intensity={1.2} />
        <Environment preset="city" environmentIntensity={0.5} />
        <Robot />
      </Canvas>
    </div>
  );
}

useGLTF.preload("/models/cartoon_robot.glb");
