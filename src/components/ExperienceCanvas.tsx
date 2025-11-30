import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Mesh } from 'three';

// Declare intrinsic elements to fix TypeScript errors when R3F types are not automatically picked up
declare global {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      torusKnotGeometry: any;
      meshStandardMaterial: any;
      points: any;
      bufferGeometry: any;
      bufferAttribute: any;
      pointsMaterial: any;
      ambientLight: any;
      directionalLight: any;
      pointLight: any;
      fog: any;
    }
  }
}

// Augment React's JSX namespace as well for compatibility with newer React types
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      mesh: any;
      torusKnotGeometry: any;
      meshStandardMaterial: any;
      points: any;
      bufferGeometry: any;
      bufferAttribute: any;
      pointsMaterial: any;
      ambientLight: any;
      directionalLight: any;
      pointLight: any;
      fog: any;
    }
  }
}

// A simple rotating mesh component
const RotatingShape = () => {
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Rotation
      meshRef.current.rotation.x += delta * 0.2;
      meshRef.current.rotation.y += delta * 0.3;
      
      // Floating effect
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      {/* Increased segments for smoother chrome reflections */}
      <torusKnotGeometry args={[1.2, 0.4, 250, 32]} />
      {/* 
        Updated Material: Chrome/Silver
        color: Bright silver (#d4d7dd)
        roughness: Low for sharp reflections
        metalness: Max for chrome look
        emissive: Removed to keep it achromatic
      */}
      <meshStandardMaterial 
        color="#d4d7dd" 
        roughness={0.12} 
        metalness={1.0}
        wireframe={false}
      />
    </mesh>
  );
};

const Stars = () => {
  const groupRef = useRef<any>(null);
  const starCount = 300;
  const positions = React.useMemo(() => {
    const pos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 25; 
      pos[i * 3 + 1] = (Math.random() - 0.5) * 25; 
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2; 
    }
    return pos;
  }, []);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y -= delta * 0.03;
    }
  });

  return (
    <points ref={groupRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={starCount}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#88ccff" sizeAttenuation transparent opacity={0.6} />
    </points>
  );
};

const ExperienceCanvas: React.FC = () => {
  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
        {/* Lights - tuned for silver/chrome look */}
        
        {/* Low ambient light to keep shadows dark and contrasted */}
        <ambientLight intensity={0.2} />
        
        {/* Strong White Key Light - Defines the silver shape */}
        <directionalLight position={[5, 5, 5]} intensity={2.0} color="#ffffff" />
        
        {/* Orange Rim Light - Adds the accent reflection without coloring the whole object */}
        <directionalLight position={[-5, 5, -5]} intensity={1.5} color="#ff8a3c" />
        
        {/* Cyan Fill - Subtle cyber underlight */}
        <pointLight position={[0, -5, 0]} intensity={0.5} color="#20e0ff" />
        
        {/* Objects */}
        <RotatingShape />
        <Stars />
        
        {/* Fog for depth blending into dark background */}
        <fog attach="fog" args={['#050608', 5, 16]} />
      </Canvas>
    </div>
  );
};

export default ExperienceCanvas;