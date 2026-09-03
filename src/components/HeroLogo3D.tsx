"use client";

import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { Float, Environment, ContactShadows, PresentationControls, Sparkles, Center } from "@react-three/drei";
import * as THREE from "three";
import { SVGLoader } from "three-stdlib";

function ExtrudedLogo() {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  
  // Cargar el SVG y parsearlo
  const svg = useLoader(SVGLoader, "/logo.svg");
  // @ts-ignore - TS types for SVGLoader might differ in some @types/three versions
  const shapes = useMemo(() => svg.paths.map((p) => p.toShapes(true)), [svg]);

  // Animación de aparición y rotación constante
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.scale.lerp(new THREE.Vector3(1, 1, 1), delta * 2);
      groupRef.current.rotation.y += delta * 0.2;
      
      // Animación de grosor (depth) al hacer hover
      // SVGLoader/ExtrudeGeometry no permite animar el 'depth' directamente sin recrear la geometría
      // Así que animaremos la escala Z
      const targetScaleZ = hovered ? 3 : 1;
      groupRef.current.scale.z += (targetScaleZ - groupRef.current.scale.z) * delta * 5;
    }
  });

  return (
    <group ref={groupRef} scale={[0, 0, 0]} rotation={[0, 0, 0]}>
      <Float speed={3} rotationIntensity={0.5} floatIntensity={2} onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
        <Center>
          <group scale={[0.01, -0.01, 0.01]}>
            {svg.paths.map((path, index) => {
              const color = path.color;
              return shapes[index].map((shape, shapeIndex) => (
                <mesh key={`${index}-${shapeIndex}`} castShadow receiveShadow>
                  <extrudeGeometry 
                    args={[
                      shape, 
                      { 
                        depth: 5, 
                        bevelEnabled: true, 
                        bevelThickness: 1, 
                        bevelSize: 0.5, 
                        bevelSegments: 1 
                      }
                    ]} 
                  />
                  <meshStandardMaterial 
                    color={color} 
                    metalness={0.9} 
                    roughness={0.1} 
                    envMapIntensity={hovered ? 3 : 2}
                  />
                </mesh>
              ));
            })}
          </group>
        </Center>
      </Float>

      {/* Partículas Envolventes Cinemáticas (Solo las sutiles) */}
      <Sparkles count={40} scale={8} size={6} speed={0.3} color="#F29A2E" opacity={hovered ? 0.6 : 0.2} />
    </group>
  );
}

export default function HeroLogo3D() {
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-full h-full min-h-[400px]"></div>;

  return (
    <div 
      className="w-full h-[400px] md:h-[500px] lg:h-[700px] cursor-grab active:cursor-grabbing opacity-0 animate-fade-in-up" 
      style={{ animationDelay: '0.5s', animationFillMode: 'forwards', touchAction: 'pan-y' }}
    >
      <Canvas 
        camera={{ position: [0, 0, 15], fov: 45 }} 
        dpr={[1, 1.5]}
        style={{ touchAction: 'pan-y' }}
      >
        
        {/* Iluminación Dramática */}
        <ambientLight intensity={0.4} />
        <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} intensity={3} castShadow color="#ffffff" />
        <spotLight position={[-10, -10, -10]} angle={0.3} penumbra={1} intensity={2} color="#F29A2E" />
        <pointLight position={[0, 0, 5]} intensity={1.5} color="#ffffff" />
        
        <PresentationControls
          snap={true}
          rotation={[0, -0.1, 0]}
          polar={[-Math.PI / 3, Math.PI / 3]}
          azimuth={[-Math.PI / 2, Math.PI / 2]}
        >
          <React.Suspense fallback={null}>
            <ExtrudedLogo />
          </React.Suspense>
        </PresentationControls>

        {/* Reflejos HDRI Ultra Realistas */}
        <Environment preset="studio" />
        
        <ContactShadows
          position={[0, -3, 0]}
          opacity={0.5}
          scale={15}
          blur={1.5}
          resolution={256}
          far={5}
          color="#071426"
        />
      </Canvas>
    </div>
  );
}
