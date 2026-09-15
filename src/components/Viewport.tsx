import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import * as THREE from 'three'
import { DoorScene } from '../scene/DoorScene'
import { ErrorBoundary } from './ErrorBoundary'
import { ViewportChrome } from './ConfigPanel'
import { WebGLFallback } from './WebGLFallback'

function SceneFallback() {
  return (
    <mesh position={[0, 1.05, 0]}>
      <boxGeometry args={[0.9, 2.1, 0.05]} />
      <meshStandardMaterial color="#c4a06a" roughness={0.55} />
    </mesh>
  )
}

export function Viewport({ webgl }: { webgl: boolean }) {
  if (!webgl) {
    return (
      <div className="relative h-full min-h-[320px]">
        <WebGLFallback />
        <ViewportChrome />
      </div>
    )
  }

  return (
    <div className="relative h-full min-h-[320px] bg-[#cfd8e2]">
      <ErrorBoundary fallback={<WebGLFallback />}>
        <Suspense fallback={<div className="h-full bg-[#cfd8e2]" />}>
          <Canvas
            shadows
            dpr={[1, 1.5]}
            gl={{
              antialias: true,
              preserveDrawingBuffer: true,
              powerPreference: 'high-performance',
              failIfMajorPerformanceCaveat: false,
              alpha: false,
            }}
            camera={{ position: [0, 1.28, 3.55], fov: 32, near: 0.1, far: 40 }}
            onCreated={({ gl }) => {
              gl.setClearColor('#cfd8e2')
              gl.toneMapping = THREE.ACESFilmicToneMapping
              gl.toneMappingExposure = 1.12
              gl.shadowMap.enabled = true
              gl.shadowMap.type = THREE.PCFSoftShadowMap
            }}
          >
            <ErrorBoundary fallback={<SceneFallback />}>
              <DoorScene />
            </ErrorBoundary>
          </Canvas>
        </Suspense>
      </ErrorBoundary>
      <ViewportChrome />
    </div>
  )
}
