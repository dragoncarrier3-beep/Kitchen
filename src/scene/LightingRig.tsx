import { ContactShadows, Environment, Lightformer } from '@react-three/drei'
import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import type { LightingMode } from '../adapters/types'

function EnvironmentStrength({ value }: { value: number }) {
  const scene = useThree((state) => state.scene)
  useEffect(() => {
    scene.environmentIntensity = value
  }, [scene, value])
  return null
}

export function LightingRig({ mode }: { mode: LightingMode }) {
  const night = mode === 'night'

  return (
    <>
      <color attach="background" args={[night ? '#0b0e14' : '#d7dee6']} />
      <fog attach="fog" args={[night ? '#0b0e14' : '#d7dee6', 8, 22]} />
      <hemisphereLight
        color={night ? '#3a4254' : '#e8eef6'}
        groundColor={night ? '#1a120c' : '#9c8c78'}
        intensity={night ? 0.28 : 0.62}
      />
      <ambientLight intensity={night ? 0.12 : 0.22} />
      <directionalLight
        position={night ? [-4, 6, 3] : [5.5, 8.5, 4.5]}
        intensity={night ? 0.35 : 2.35}
        color={night ? '#9bb0d0' : '#fff4e5'}
        castShadow
        shadow-mapSize={[2048, 2048]}
        shadow-bias={-0.00025}
        shadow-camera-near={1}
        shadow-camera-far={24}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-2}
      />
      <directionalLight
        position={[-3.5, 3.2, 2.8]}
        intensity={night ? 0.08 : 0.45}
        color={night ? '#6f7c94' : '#cfd8e6'}
      />
      <Environment resolution={256}>
        <Lightformer intensity={night ? 0.4 : 2.4} position={[0, 4, 1]} scale={[8, 1.4, 1]} />
        <Lightformer intensity={night ? 0.2 : 1.1} position={[-4, 2, 3]} scale={[3, 4, 1]} color="#c9d7ea" />
        <Lightformer
          intensity={night ? 1.6 : 0.8}
          position={[3, 1.2, 2]}
          scale={[2, 3, 1]}
          color={night ? '#ffb066' : '#ffffff'}
        />
        <Lightformer intensity={night ? 0.15 : 0.9} position={[0, 2, -4]} scale={[6, 3, 1]} color="#ffe8c8" />
      </Environment>
      <EnvironmentStrength value={night ? 0.18 : 0.72} />
      <ContactShadows
        position={[0, 0.002, 0.6]}
        opacity={night ? 0.55 : 0.42}
        scale={10}
        blur={2.2}
        far={6}
        color="#1a1612"
      />
    </>
  )
}
