"use client";

import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, Float, Sphere, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";

function VolleyBall() {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.2;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere ref={meshRef} args={[1.5, 64, 64]} castShadow receiveShadow>
        <MeshDistortMaterial
          color="#F29A2E"
          roughness={0.2}
          metalness={0.8}
          distort={0.1}
          speed={2}
          envMapIntensity={2}
        />
      </Sphere>
    </Float>
  );
}

export default function InteractiveBall3D() {
  return (
    <section className="relative w-full h-[80vh] bg-[#F7F8FA] flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 z-0">
        <Canvas shadows camera={{ position: [0, 0, 5], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <pointLight position={[-10, -10, -10]} intensity={0.5} />
          
          <VolleyBall />
          
          <Environment preset="city" />
          <OrbitControls 
            enableZoom={false} 
            enablePan={false}
            minPolarAngle={Math.PI / 2.5}
            maxPolarAngle={Math.PI / 1.5}
          />
        </Canvas>
      </div>

      <div className="relative z-10 pointer-events-none text-center">
        <h3 className="text-4xl md:text-6xl font-heading font-bold text-[#0F2347] uppercase drop-shadow-md">
          Tecnología de Punta
        </h3>
        <p className="text-xl md:text-2xl text-[#64748B] mt-4 font-sans max-w-2xl mx-auto drop-shadow-sm">
          Interactivo, Dinámico, Campeón.
        </p>
      </div>
    </section>
  );
}
