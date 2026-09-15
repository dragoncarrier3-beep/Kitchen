import { useThree } from '@react-three/fiber'
import { useLayoutEffect } from 'react'
import type { LightingMode } from '../adapters/types'
import { getStudioEnvironment } from '../lib/textures'

export function LightingRig({ mode }: { mode: LightingMode }) {
  const night = mode === 'night'
  const scene = useThree((state) => state.scene)

  useLayoutEffect(() => {
    try {
      scene.environment = getStudioEnvironment()
      scene.environmentIntensity = night ? 0.22 : 0.85
    } catch {
      scene.environment = null
    }
  }, [scene, night])

  return (
    <>
      <color attach="background" args={[night ? '#0d1118' : '#cfd8e2']} />
      <fog attach="fog" args={[night ? '#0d1118' : '#cfd8e2', 9, 24]} />
      <hemisphereLight
        color={night ? '#445066' : '#eef3f8'}
        groundColor={night ? '#1a140e' : '#9a8c7a'}
        intensity={night ? 0.35 : 0.7}
      />
      <ambientLight intensity={night ? 0.16 : 0.28} color={night ? '#ffd8b0' : '#ffffff'} />
      <directionalLight
        position={night ? [-3.2, 5.5, 2.4] : [4.8, 7.4, 5.2]}
        intensity={night ? 0.45 : 2.6}
        color={night ? '#9eb4d4' : '#fff6ea'}
        castShadow
        shadow-mapSize={[1024, 1024]}
        shadow-bias={-0.0003}
        shadow-camera-near={1}
        shadow-camera-far={22}
        shadow-camera-left={-5}
        shadow-camera-right={5}
        shadow-camera-top={6}
        shadow-camera-bottom={-1.5}
      />
      <directionalLight position={[-4, 2.8, 3]} intensity={night ? 0.12 : 0.55} color={night ? '#738199' : '#d5deea'} />
      <spotLight
        position={[0, 3.15, 1.35]}
        angle={0.55}
        penumbra={0.7}
        intensity={night ? 18 : 8}
        color={night ? '#ffc27a' : '#fff4dc'}
        distance={8}
        castShadow={false}
      />
    </>
  )
}
