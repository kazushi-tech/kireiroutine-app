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
      {/* Balanced size - visible but not overwhelming */}
      <torusKnotGeometry args={[1.1, 0.35, 250, 32]} />
      {/* 
        Updated Material: Brilliant Chrome
        color: Pure bright silver for maximum reflections
        roughness: Very low for mirror-like finish
        metalness: Max for full chrome effect
      */}
      <meshStandardMaterial 
        color="#f1f5f9" 
        roughness={0.05} 
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
    <div className="w-full h-full min-h-[400px]" role="img" aria-label="回転する3Dトーラスノットのアニメーション">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        {/* Lights - tuned for silver/chrome look */}
        
        {/* Low ambient light to keep shadows dark and contrasted */}
        <ambientLight intensity={0.3} />
        
        {/* Strong White Key Light - Defines the silver shape */}
        <directionalLight position={[5, 5, 5]} intensity={2.5} color="#ffffff" />
        
        {/* Orange/Red Rim Light - Dramatic accent */}
        <directionalLight position={[-5, 3, -3]} intensity={2.0} color="#ff6b35" />
        
        {/* Cyan Fill - Cyber underlight from below */}
        <pointLight position={[0, -4, 2]} intensity={0.8} color="#00f0ff" />
        
        {/* Objects */}
        <RotatingShape />
        <Stars />
        
        {/* Fog for depth blending into dark background */}
        <fog attach="fog" args={['#0f172a', 5, 16]} />
      </Canvas>
    </div>
  );
};

export default ExperienceCanvas;