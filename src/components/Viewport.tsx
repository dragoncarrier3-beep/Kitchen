import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import * as THREE from 'three'
import { DoorScene } from '../scene/DoorScene'
import { ErrorBoundary } from './ErrorBoundary'
import { ViewportChrome } from './ConfigPanel'
import { WebGLFallback } from './WebGLFallback'

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
            <DoorScene />
          </Canvas>
        </Suspense>
      </ErrorBoundary>
      <ViewportChrome />
    </div>
  )
}
