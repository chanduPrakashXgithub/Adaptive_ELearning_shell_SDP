import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box } from '@react-three/drei';
import * as THREE from 'three';

const BookModel = () => {
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
      <Box
        ref={bookRef}
        args={[1.5, 2, 0.2]}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial color="#8B4513" />
      </Box>
      
      {/* Book pages */}
      <Box
        args={[1.4, 1.9, 0.15]}
        position={[0, 0, 0.05]}
      >
        <meshStandardMaterial color="#F5F5DC" />
      </Box>
      
      {/* Book spine details */}
      <Box
        args={[0.1, 1.8, 0.18]}
        position={[-0.7, 0, 0]}
      >
        <meshStandardMaterial color="#654321" />
      </Box>
    </group>
  );
};

export default BookModel;