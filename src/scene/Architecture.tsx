import { useStaticMaterial } from './materials'

function Sconce({ position, lit }: { position: [number, number, number]; lit: boolean }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.08, 0.18, 0.06]} />
        <meshStandardMaterial color="#2a2a2c" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, -0.08, 0.02]}>
        <boxGeometry args={[0.06, 0.05, 0.05]} />
        <meshStandardMaterial
          color={lit ? '#ffd9a0' : '#d9c8a8'}
          emissive={lit ? '#ffb347' : '#000000'}
          emissiveIntensity={lit ? 2.2 : 0}
          roughness={0.4}
        />
      </mesh>
      {lit ? <pointLight intensity={6} distance={5.5} color="#ffb066" position={[0, -0.12, 0.15]} /> : null}
    </group>
  )
}

function Planter({ position }: { position: [number, number, number] }) {
  const stone = useStaticMaterial('stone', '#8a8176', { roughness: 0.78, repeat: [1, 1] })
  return (
    <group position={position}>
      <mesh material={stone} position={[0, 0.22, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.55, 0.44, 0.42]} />
      </mesh>
      <mesh position={[0, 0.52, 0]} castShadow>
        <sphereGeometry args={[0.28, 16, 12]} />
        <meshStandardMaterial color="#2f4a34" roughness={0.9} />
      </mesh>
      <mesh position={[0.08, 0.68, 0.04]} castShadow>
        <sphereGeometry args={[0.18, 14, 10]} />
        <meshStandardMaterial color="#3b5c40" roughness={0.88} />
      </mesh>
    </group>
  )
}

export function Architecture({
  openingWidth,
  openingHeight,
  night,
}: {
  openingWidth: number
  openingHeight: number
  night: boolean
}) {
  const wall = useStaticMaterial('stucco', '#d8d0c4', { roughness: 0.86, repeat: [3.2, 2.2] })
  const floor = useStaticMaterial('stone', '#9a9388', { roughness: 0.72, metalness: 0.08, repeat: [6, 6] })
  const interior = useStaticMaterial('interior', '#6a5848', { roughness: 0.74, repeat: [2, 2] })
  const innerFloor = useStaticMaterial('walnut', '#4a3426', { roughness: 0.5, repeat: [3, 4] })

  const wallW = 7.4
  const wallH = 3.35
  const wallT = 0.28
  const openW = openingWidth + 0.2
  const openH = openingHeight + 0.12
  const side = (wallW - openW) / 2

  return (
    <group>
      <mesh material={floor} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 2.2]} receiveShadow>
        <planeGeometry args={[14, 10]} />
      </mesh>
      <mesh material={innerFloor} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.001, -2.1]} receiveShadow>
        <planeGeometry args={[5.4, 4.4]} />
      </mesh>

      <mesh material={wall} position={[-(openW / 2 + side / 2), wallH / 2, -wallT / 2]} receiveShadow castShadow>
        <boxGeometry args={[side, wallH, wallT]} />
      </mesh>
      <mesh material={wall} position={[openW / 2 + side / 2, wallH / 2, -wallT / 2]} receiveShadow castShadow>
        <boxGeometry args={[side, wallH, wallT]} />
      </mesh>
      <mesh
        material={wall}
        position={[0, openH + (wallH - openH) / 2, -wallT / 2]}
        receiveShadow
        castShadow
      >
        <boxGeometry args={[openW, Math.max(0.2, wallH - openH), wallT]} />
      </mesh>

      <mesh material={interior} position={[0, 1.4, -4.15]} receiveShadow>
        <boxGeometry args={[5.2, 2.8, 0.12]} />
      </mesh>
      <mesh material={interior} position={[-2.55, 1.4, -2.2]} receiveShadow>
        <boxGeometry args={[0.12, 2.8, 4]} />
      </mesh>
      <mesh material={interior} position={[2.55, 1.4, -2.2]} receiveShadow>
        <boxGeometry args={[0.12, 2.8, 4]} />
      </mesh>
      <mesh position={[0, 2.82, -2.1]} receiveShadow>
        <boxGeometry args={[5.3, 0.08, 4.2]} />
        <meshStandardMaterial color="#2c241c" roughness={0.8} />
      </mesh>

      <mesh position={[0, 3.42, 0.55]} castShadow>
        <boxGeometry args={[4.6, 0.12, 1.6]} />
        <meshStandardMaterial color="#ebe4d8" roughness={0.7} />
      </mesh>
      <mesh position={[-2.35, 2.9, 0.5]} castShadow>
        <boxGeometry args={[0.12, 1.1, 1.5]} />
        <meshStandardMaterial color="#ebe4d8" roughness={0.7} />
      </mesh>
      <mesh position={[2.35, 2.9, 0.5]} castShadow>
        <boxGeometry args={[0.12, 1.1, 1.5]} />
        <meshStandardMaterial color="#ebe4d8" roughness={0.7} />
      </mesh>

      <mesh position={[-1.15, 1.55, 0.02]} castShadow>
        <boxGeometry args={[0.28, 0.38, 0.04]} />
        <meshStandardMaterial color="#1f1f22" metalness={0.4} roughness={0.4} />
      </mesh>
      <mesh position={[-1.15, 1.55, 0.042]}>
        <boxGeometry args={[0.2, 0.12, 0.01]} />
        <meshStandardMaterial color="#d9c27a" metalness={0.6} roughness={0.35} />
      </mesh>

      <Sconce position={[-1.55, 2.15, 0.08]} lit={night} />
      <Sconce position={[1.55, 2.15, 0.08]} lit={night} />
      <Planter position={[-2.15, 0, 1.15]} />
      <Planter position={[2.15, 0, 1.15]} />

      {night ? (
        <pointLight position={[0, 1.6, -2.4]} intensity={4.5} distance={6} color="#ffcf9a" />
      ) : null}
    </group>
  )
}
