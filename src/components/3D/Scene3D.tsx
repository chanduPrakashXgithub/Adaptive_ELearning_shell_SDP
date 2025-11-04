import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import BookModel from './BookModel';

const Scene3D = () => {
  return (
    <div className="h-64 w-full rounded-lg overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100">
      <Canvas
        camera={{ position: [3, 3, 3], fov: 45 }}
        shadows
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 10, 5]}
            castShadow
            intensity={1}
            shadow-mapSize={[2048, 2048]}
          />
          
          {/* 3D Book Model */}
          <BookModel />
          
          {/* Environment and shadows */}
          <ContactShadows
            position={[0, -1.5, 0]}
            opacity={0.3}
            width={5}
            height={5}
            blur={2}
          />
          
          {/* Controls */}
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            maxPolarAngle={Math.PI / 2}
            minPolarAngle={Math.PI / 4}
          />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default Scene3D;