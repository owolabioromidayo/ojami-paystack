//@ts-nocheck

"use client"

import { useState, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import { Button } from "@/components/ui/button"

interface ChairProps {
  scale: number
  rotation: number
}

function Chair({ scale, rotation }: ChairProps) {
  const groupRef = useRef<THREE.Group>(null)
  const [hovered, setHovered] = useState(false)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = rotation
    }
  })

  return (
    <group 
      ref={groupRef} 
      scale={[scale, scale, scale]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      {/* Chair seat */}
      <mesh position={[0, 1, 0]}>
        <boxGeometry args={[2, 0.2, 2]} />
        <meshStandardMaterial color={hovered ? "orange" : "brown"} />
      </mesh>
      {/* Chair back */}
      <mesh position={[0, 2, -0.9]}>
        <boxGeometry args={[2, 2, 0.2]} />
        <meshStandardMaterial color={hovered ? "orange" : "brown"} />
      </mesh>
      {/* Chair legs */}
      {[[-0.9, -0.5, -0.9], [0.9, -0.5, -0.9], [-0.9, -0.5, 0.9], [0.9, -0.5, 0.9]].map((pos, index) => (
        <mesh key={index} position={pos}>
          <cylinderGeometry args={[0.1, 0.1, 3]} />
          <meshStandardMaterial color={hovered ? "orange" : "brown"} />
        </mesh>
      ))}
    </group>
  )
}

export default function ChairViewer() {
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)

  return (
    <div className="w-full h-screen flex flex-col">
      <div className="flex-grow">
        <Canvas>
          <PerspectiveCamera makeDefault position={[5, 5, 5]} />
          <OrbitControls />
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <Chair scale={scale} rotation={rotation} />
        </Canvas>
      </div>
      {/* <div className="p-4 bg-gray-100">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Scale</label>
          <Slider
            min={0.5}
            max={2}
            step={0.1}
            value={[scale]}
            onValueChange={(value) => setScale(value[0])}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Rotation</label>
          <Slider
            min={0}
            max={Math.PI * 2}
            step={0.1}
            value={[rotation]}
            onValueChange={(value) => setRotation(value[0])}
          />
        </div>
        <div className="flex justify-between">
          <Button onClick={() => setScale(1)}>Reset Scale</Button>
          <Button onClick={() => setRotation(0)}>Reset Rotation</Button>
        </div>
      </div> */}
    </div>
  )
}