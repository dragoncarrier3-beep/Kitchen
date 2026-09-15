import { useMemo } from 'react'
import type { HandleOption } from '../adapters/types'

function HardwareMaterial({
  color,
  metalness,
  roughness,
}: {
  color: string
  metalness: number
  roughness: number
}) {
  return <meshStandardMaterial color={color} metalness={metalness} roughness={roughness} envMapIntensity={1.4} />
}

function LeverHandle({ option }: { option: HandleOption }) {
  return (
    <group>
      <mesh castShadow>
        <cylinderGeometry args={[0.028, 0.028, 0.012, 24]} />
        <HardwareMaterial color={option.finishColor} metalness={option.metalness} roughness={option.roughness} />
      </mesh>
      <mesh position={[0, 0, 0.018]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.011, 0.011, 0.036, 16]} />
        <HardwareMaterial color={option.finishColor} metalness={option.metalness} roughness={option.roughness} />
      </mesh>
      <mesh position={[-0.07, 0, 0.036]} rotation={[0, 0, -0.08]} castShadow>
        <boxGeometry args={[0.132, 0.018, 0.014]} />
        <HardwareMaterial color={option.finishColor} metalness={option.metalness} roughness={option.roughness} />
      </mesh>
      <mesh position={[-0.128, 0, 0.036]} castShadow>
        <sphereGeometry args={[0.01, 16, 16]} />
        <HardwareMaterial color={option.finishColor} metalness={option.metalness} roughness={option.roughness} />
      </mesh>
    </group>
  )
}

function PullBar({ option }: { option: HandleOption }) {
  return (
    <group>
      <mesh position={[0, 0.28, 0.028]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.05, 16]} />
        <HardwareMaterial color={option.finishColor} metalness={option.metalness} roughness={option.roughness} />
      </mesh>
      <mesh position={[0, -0.28, 0.028]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.05, 16]} />
        <HardwareMaterial color={option.finishColor} metalness={option.metalness} roughness={option.roughness} />
      </mesh>
      <mesh position={[0, 0, 0.052]} castShadow>
        <cylinderGeometry args={[0.014, 0.014, 0.62, 20]} />
        <HardwareMaterial color={option.finishColor} metalness={option.metalness} roughness={option.roughness} />
      </mesh>
      <mesh position={[0, 0.31, 0.052]} castShadow>
        <sphereGeometry args={[0.014, 16, 16]} />
        <HardwareMaterial color={option.finishColor} metalness={option.metalness} roughness={option.roughness} />
      </mesh>
      <mesh position={[0, -0.31, 0.052]} castShadow>
        <sphereGeometry args={[0.014, 16, 16]} />
        <HardwareMaterial color={option.finishColor} metalness={option.metalness} roughness={option.roughness} />
      </mesh>
    </group>
  )
}

function Lockset({ color, metalness, roughness }: { color: string; metalness: number; roughness: number }) {
  return (
    <group>
      <mesh castShadow>
        <boxGeometry args={[0.034, 0.15, 0.01]} />
        <HardwareMaterial color={color} metalness={metalness} roughness={roughness} />
      </mesh>
      <mesh position={[0, 0.028, 0.012]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.012, 0.012, 0.02, 16]} />
        <HardwareMaterial color="#d9c27a" metalness={0.9} roughness={0.22} />
      </mesh>
      <mesh position={[0, -0.038, 0.008]} castShadow>
        <boxGeometry args={[0.018, 0.028, 0.006]} />
        <HardwareMaterial color={color} metalness={metalness} roughness={roughness} />
      </mesh>
    </group>
  )
}

export function DoorHardware({
  option,
  leafWidth,
  leafHeight,
  leafThickness,
}: {
  option: HandleOption
  leafWidth: number
  leafHeight: number
  leafThickness: number
}) {
  const handleHeight = useMemo(() => Math.min(1.05, leafHeight * 0.52), [leafHeight])
  const latchX = leafWidth - 0.07
  const z = leafThickness / 2 + 0.002
  const lockColor = option.style === 'lever_stainless' ? '#c5c8cc' : '#141416'
  const lockMetal = option.style === 'lever_stainless' ? 0.9 : 0.7

  return (
    <group>
      <group userData={{ componentId: 'door_handle' }} position={[latchX, handleHeight, z]}>
        {option.style === 'pull_bar' ? <PullBar option={option} /> : <LeverHandle option={option} />}
      </group>
      <group userData={{ componentId: 'door_lock' }} position={[latchX, handleHeight - 0.12, z]}>
        <Lockset color={lockColor} metalness={lockMetal} roughness={option.roughness} />
      </group>
    </group>
  )
}
