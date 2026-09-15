import { useLayoutEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { FrameFinish, HandleOption, MaterialFinish } from '../adapters/types'
import { DoorHardware } from './DoorHardware'
import { useDoorMaterial, useFrameMaterial } from './materials'

const LEAF_THICKNESS = 0.046
const FRAME_WIDTH = 0.078
const FRAME_DEPTH = 0.13
const THRESHOLD_H = 0.018
const CLEARANCE = 0.005

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
  const leafWidth = Math.max(0.6, width - CLEARANCE * 2)
  const leafHeight = Math.max(1.4, height - THRESHOLD_H - CLEARANCE)
  const hingeX = -width / 2
  const doorMat = useDoorMaterial(doorFinish)
  const frameMat = useFrameMaterial(frameFinish)
  const pivot = useRef<THREE.Group>(null)
  const angle = useRef(0)

  useFrame((_, delta) => {
    const target = open ? Math.PI * 0.5 : 0
    angle.current = THREE.MathUtils.damp(angle.current, target, 5.2, delta)
    if (pivot.current) pivot.current.rotation.y = angle.current
  })

  const leafGeo = useMemo(() => new THREE.BoxGeometry(leafWidth, leafHeight, LEAF_THICKNESS), [leafWidth, leafHeight])
  const panelGeo = useMemo(
    () => new THREE.BoxGeometry(leafWidth * 0.58, leafHeight * 0.72, 0.008),
    [leafWidth, leafHeight],
  )
  const glassGeo = useMemo(
    () => new THREE.BoxGeometry(leafWidth * 0.18, leafHeight * 0.72, 0.012),
    [leafWidth, leafHeight],
  )

  useLayoutEffect(
    () => () => {
      leafGeo.dispose()
      panelGeo.dispose()
      glassGeo.dispose()
    },
    [leafGeo, panelGeo, glassGeo],
  )

  const jambH = height + FRAME_WIDTH * 0.15
  const glassX = leafWidth * 0.32

  return (
    <group>
      <group userData={{ componentId: 'door_frame' }}>
        <mesh material={frameMat} position={[-(width / 2 + FRAME_WIDTH / 2), height / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[FRAME_WIDTH, jambH, FRAME_DEPTH]} />
        </mesh>
        <mesh material={frameMat} position={[width / 2 + FRAME_WIDTH / 2, height / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[FRAME_WIDTH, jambH, FRAME_DEPTH]} />
        </mesh>
        <mesh material={frameMat} position={[0, height + FRAME_WIDTH / 2, 0]} castShadow receiveShadow>
          <boxGeometry args={[width + FRAME_WIDTH * 2, FRAME_WIDTH, FRAME_DEPTH]} />
        </mesh>
        <mesh material={frameMat} position={[-(width / 2 + FRAME_WIDTH + 0.018), height / 2, 0.02]} castShadow>
          <boxGeometry args={[0.036, jambH + 0.04, FRAME_DEPTH + 0.02]} />
        </mesh>
        <mesh material={frameMat} position={[width / 2 + FRAME_WIDTH + 0.018, height / 2, 0.02]} castShadow>
          <boxGeometry args={[0.036, jambH + 0.04, FRAME_DEPTH + 0.02]} />
        </mesh>
        <mesh material={frameMat} position={[0, height + FRAME_WIDTH + 0.018, 0.02]} castShadow>
          <boxGeometry args={[width + FRAME_WIDTH * 2 + 0.072, 0.036, FRAME_DEPTH + 0.02]} />
        </mesh>
      </group>

      <mesh userData={{ componentId: 'door_threshold' }} position={[0, THRESHOLD_H / 2, 0.01]} castShadow receiveShadow>
        <boxGeometry args={[width + 0.02, THRESHOLD_H, 0.16]} />
        <meshStandardMaterial color="#6b675f" metalness={0.55} roughness={0.38} />
      </mesh>

      <group ref={pivot} position={[hingeX, 0, 0]}>
        <group position={[leafWidth / 2, THRESHOLD_H + CLEARANCE + leafHeight / 2, 0]}>
          <mesh userData={{ componentId: 'door_leaf' }} geometry={leafGeo} material={doorMat} castShadow receiveShadow />
          <mesh
            geometry={panelGeo}
            material={doorMat}
            position={[-leafWidth * 0.12, 0.02, LEAF_THICKNESS / 2 + 0.001]}
            castShadow
          />
          <mesh position={[-leafWidth * 0.12, 0.02, LEAF_THICKNESS / 2 + 0.004]}>
            <boxGeometry args={[leafWidth * 0.56, 0.012, 0.004]} />
            <meshStandardMaterial color="#2a241c" metalness={0.4} roughness={0.45} />
          </mesh>
          <group userData={{ componentId: 'door_glass' }} position={[glassX, 0.02, 0]}>
            <mesh geometry={glassGeo}>
              <meshPhysicalMaterial
                color="#9fb8c6"
                metalness={0.05}
                roughness={0.06}
                transparent
                opacity={0.32}
                envMapIntensity={1.6}
                clearcoat={1}
                clearcoatRoughness={0.08}
              />
            </mesh>
            <mesh material={doorMat} position={[-leafWidth * 0.095, 0, LEAF_THICKNESS / 2 + 0.002]}>
              <boxGeometry args={[0.014, leafHeight * 0.74, 0.01]} />
            </mesh>
            <mesh material={doorMat} position={[leafWidth * 0.095, 0, LEAF_THICKNESS / 2 + 0.002]}>
              <boxGeometry args={[0.014, leafHeight * 0.74, 0.01]} />
            </mesh>
          </group>
          <group position={[-leafWidth / 2, -leafHeight / 2, 0]}>
            <DoorHardware
              option={handle}
              leafWidth={leafWidth}
              leafHeight={leafHeight}
              leafThickness={LEAF_THICKNESS}
            />
          </group>
        </group>
      </group>
    </group>
  )
}
