import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { FrameFinish, HandleOption, MaterialFinish } from '../adapters/types'
import { DoorHardware } from './DoorHardware'
import { useDoorMaterial, useFrameMaterial } from './materials'

const LEAF_T = 0.048
const FRAME_W = 0.08
const FRAME_D = 0.14
const THRESHOLD_H = 0.02
const GAP = 0.004

function Hinge({ y, color }: { y: number; color: string }) {
  return (
    <group position={[0.01, y, 0.01]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.09, 12]} />
        <meshStandardMaterial color={color} metalness={0.82} roughness={0.28} />
      </mesh>
      <mesh position={[0.018, 0, 0]}>
        <boxGeometry args={[0.028, 0.07, 0.004]} />
        <meshStandardMaterial color={color} metalness={0.82} roughness={0.28} />
      </mesh>
    </group>
  )
}

export function DoorAssembly({
  widthMm,
  heightMm,
  open,
  doorFinish,
  frameFinish,
  handle,
}: {
  widthMm: number
  heightMm: number
  open: boolean
  doorFinish: MaterialFinish
  frameFinish: FrameFinish
  handle: HandleOption
}) {
  const width = widthMm / 1000
  const height = heightMm / 1000
  const leafW = Math.max(0.62, width - GAP * 2)
  const leafH = Math.max(1.5, height - THRESHOLD_H - GAP)
  const hingeX = -width / 2
  const doorMat = useDoorMaterial(doorFinish)
  const frameMat = useFrameMaterial(frameFinish)
  const pivot = useRef<THREE.Group>(null)
  const angle = useRef(0)
  const hingeColor = handle.style === 'lever_stainless' ? '#c5c8cc' : '#2a2a2c'

  useFrame((_, delta) => {
    const target = open ? Math.PI * 0.52 : 0
    angle.current = THREE.MathUtils.damp(angle.current, target, 5.4, delta)
    if (pivot.current) pivot.current.rotation.y = angle.current
  })

  const glassW = Math.min(0.2, leafW * 0.22)
  const glassH = leafH * 0.7
  const glassX = leafW * 0.31
  const panelW = leafW * 0.52
  const panelH = leafH * 0.7

  return (
    <group>
      <group userData={{ componentId: 'door_frame' }}>
        <mesh material={frameMat} position={[-(width / 2 + FRAME_W / 2), height / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[FRAME_W, height + FRAME_W * 0.2, FRAME_D]} />
        </mesh>
        <mesh material={frameMat} position={[width / 2 + FRAME_W / 2, height / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[FRAME_W, height + FRAME_W * 0.2, FRAME_D]} />
        </mesh>
        <mesh material={frameMat} position={[0, height + FRAME_W / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[width + FRAME_W * 2, FRAME_W, FRAME_D]} />
        </mesh>
        <mesh material={frameMat} position={[-(width / 2 + FRAME_W + 0.022), height / 2 + 0.01, 0.03]} castShadow>
          <boxGeometry args={[0.044, height + 0.08, FRAME_D + 0.04]} />
        </mesh>
        <mesh material={frameMat} position={[width / 2 + FRAME_W + 0.022, height / 2 + 0.01, 0.03]} castShadow>
          <boxGeometry args={[0.044, height + 0.08, FRAME_D + 0.04]} />
        </mesh>
        <mesh material={frameMat} position={[0, height + FRAME_W + 0.022, 0.03]} castShadow>
          <boxGeometry args={[width + FRAME_W * 2 + 0.088, 0.044, FRAME_D + 0.04]} />
        </mesh>
        <mesh position={[0, height / 2, -0.055]}>
          <boxGeometry args={[width - 0.01, height - 0.02, 0.018]} />
          <meshStandardMaterial color="#1c1a18" roughness={0.9} />
        </mesh>
      </group>

      <mesh userData={{ componentId: 'door_threshold' }} position={[0, THRESHOLD_H / 2, 0.02]} castShadow receiveShadow>
        <boxGeometry args={[width + 0.04, THRESHOLD_H, 0.18]} />
        <meshStandardMaterial color="#6e6a62" metalness={0.62} roughness={0.34} />
      </mesh>

      <group ref={pivot} position={[hingeX, 0, 0]}>
        <Hinge y={0.28} color={hingeColor} />
        <Hinge y={height * 0.5} color={hingeColor} />
        <Hinge y={height - 0.32} color={hingeColor} />

        <group position={[leafW / 2, THRESHOLD_H + GAP + leafH / 2, 0]}>
          <mesh userData={{ componentId: 'door_leaf' }} material={doorMat} castShadow receiveShadow>
            <boxGeometry args={[leafW, leafH, LEAF_T]} />
          </mesh>
          <mesh material={doorMat} position={[-leafW * 0.1, 0.01, LEAF_T / 2 + 0.002]} castShadow>
            <boxGeometry args={[panelW, panelH, 0.01]} />
          </mesh>
          <mesh position={[-leafW * 0.1, 0.01, LEAF_T / 2 + 0.008]}>
            <boxGeometry args={[panelW + 0.012, 0.01, 0.004]} />
            <meshStandardMaterial color="#1a1816" metalness={0.45} roughness={0.4} />
          </mesh>
          <mesh position={[-leafW * 0.1, 0.01, LEAF_T / 2 + 0.008]}>
            <boxGeometry args={[0.01, panelH + 0.012, 0.004]} />
            <meshStandardMaterial color="#1a1816" metalness={0.45} roughness={0.4} />
          </mesh>

          <group userData={{ componentId: 'door_glass' }} position={[glassX, 0.01, 0]}>
            <mesh material={doorMat} position={[0, 0, LEAF_T / 2 + 0.003]} castShadow>
              <boxGeometry args={[glassW + 0.03, glassH + 0.03, 0.012]} />
            </mesh>
            <mesh>
              <boxGeometry args={[glassW, glassH, 0.016]} />
              <meshStandardMaterial
                color="#b7c9d4"
                metalness={0.12}
                roughness={0.08}
                transparent
                opacity={0.38}
                envMapIntensity={1.8}
              />
            </mesh>
            <mesh position={[0, 0, 0.001]}>
              <boxGeometry args={[glassW * 0.92, 0.008, 0.018]} />
              <meshStandardMaterial color="#d9c48a" metalness={0.65} roughness={0.3} />
            </mesh>
          </group>

          <mesh position={[glassX, leafH * 0.22, LEAF_T / 2 + 0.01]} castShadow>
            <sphereGeometry args={[0.012, 16, 12]} />
            <meshStandardMaterial color="#cfc8bc" metalness={0.9} roughness={0.18} />
          </mesh>

          <group position={[-leafW / 2, -leafH / 2, 0]}>
            <DoorHardware option={handle} leafWidth={leafW} leafHeight={leafH} leafThickness={LEAF_T} />
          </group>
        </group>
      </group>
    </group>
  )
}
