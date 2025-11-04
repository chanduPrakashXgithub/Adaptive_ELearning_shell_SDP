import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

const SimpleBookModel = () => {
  const bookRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (bookRef.current) {
      bookRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      bookRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
    }
  });

  return (
    <group>
      {/* Main book body */}
      <mesh ref={bookRef} position={[0, 0, 0]}>
        <boxGeometry args={[1.5, 2, 0.2]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      {/* Book pages */}
      <mesh position={[0, 0, 0.05]}>
        <boxGeometry args={[1.4, 1.9, 0.15]} />
        <meshStandardMaterial color="#F5F5DC" />
      </mesh>
      
      {/* Book spine details */}
      <mesh position={[-0.7, 0, 0]}>
        <boxGeometry args={[0.1, 1.8, 0.18]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
    </group>
  );
};

const SimpleScene3D = () => {
  return (
    <div className="h-64 w-full rounded-lg overflow-hidden bg-transparent">
      <Canvas
        camera={{ position: [3, 3, 3], fov: 45 }}
      >
        {/* Simple lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        
        {/* 3D Book Model */}
        <SimpleBookModel />
        
        {/* Controls */}
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  );
};

export default SimpleScene3D;