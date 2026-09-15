import { OrbitControls } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef } from 'react'
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import * as THREE from 'three'
import type { CameraPreset } from '../adapters/types'
import { registerViewportCapture } from '../lib/snapshot'

const PRESETS: Record<CameraPreset, { position: [number, number, number]; target: [number, number, number] }> = {
  front: { position: [0, 1.28, 3.55], target: [0, 1.12, 0] },
  angle: { position: [1.85, 1.45, 3.1], target: [0, 1.1, 0] },
  handle: { position: [0.72, 1.08, 1.35], target: [0.32, 1.02, 0] },
  full: { position: [0.15, 1.7, 5.4], target: [0, 1.15, 0] },
}

export function CameraRig({
  preset,
  nonce,
  handleX,
}: {
  preset: CameraPreset
  nonce: number
  handleX: number
}) {
  const controls = useRef<OrbitControlsImpl>(null)
  const { camera, gl } = useThree()
  const goalPos = useRef(new THREE.Vector3(...PRESETS.front.position))
  const goalTarget = useRef(new THREE.Vector3(...PRESETS.front.target))
  const animating = useRef(true)

  useEffect(() => {
    const next = PRESETS[preset]
    const pos = [...next.position] as [number, number, number]
    const target = [...next.target] as [number, number, number]
    if (preset === 'handle') {
      pos[0] = handleX + 0.45
      target[0] = handleX
    }
    goalPos.current.set(...pos)
    goalTarget.current.set(...target)
    animating.current = true
  }, [preset, nonce, handleX])

  useEffect(() => {
    registerViewportCapture(() => gl.domElement.toDataURL('image/jpeg', 0.9))
    return () => registerViewportCapture(null)
  }, [gl])

  useFrame((_, delta) => {
    if (!controls.current || !animating.current) return
    const k = 1 - Math.exp(-6 * delta)
    camera.position.lerp(goalPos.current, k)
    controls.current.target.lerp(goalTarget.current, k)
    controls.current.update()
    if (camera.position.distanceTo(goalPos.current) < 0.012) {
      camera.position.copy(goalPos.current)
      controls.current.target.copy(goalTarget.current)
      animating.current = false
    }
  })

  return (
    <OrbitControls
      ref={controls}
      makeDefault
      enablePan={false}
      minDistance={1.15}
      maxDistance={6.4}
      minPolarAngle={Math.PI * 0.32}
      maxPolarAngle={Math.PI * 0.5}
      minAzimuthAngle={-Math.PI * 0.62}
      maxAzimuthAngle={Math.PI * 0.62}
      enableDamping
      dampingFactor={0.08}
      onStart={() => {
        animating.current = false
      }}
    />
  )
}
