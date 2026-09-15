import { useStaticMaterial } from './materials'

function Sconce({ position, lit }: { position: [number, number, number]; lit: boolean }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[0.09, 0.2, 0.07]} />
        <meshStandardMaterial color="#2c2c30" metalness={0.72} roughness={0.28} />
      </mesh>
      <mesh position={[0, -0.09, 0.03]}>
        <boxGeometry args={[0.07, 0.06, 0.05]} />
        <meshStandardMaterial
          color={lit ? '#ffd9a8' : '#d9cbb0'}
          emissive={lit ? '#ffb347' : '#000000'}
          emissiveIntensity={lit ? 2.4 : 0}
          roughness={0.35}
        />
      </mesh>
      {lit ? <pointLight intensity={7} distance={6} color="#ffb066" position={[0, -0.14, 0.18]} /> : null}
    </group>
  )
}

function Planter({ position }: { position: [number, number, number] }) {
  const stone = useStaticMaterial('stone', '#8a8176', { roughness: 0.78, repeat: [1, 1] })
  return (
    <group position={position}>
      <mesh material={stone} position={[0, 0.24, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.58, 0.48, 0.44]} />
      </mesh>
      <mesh position={[0, 0.55, 0]} castShadow>
        <sphereGeometry args={[0.3, 18, 14]} />
        <meshStandardMaterial color="#2c4a32" roughness={0.92} />
      </mesh>
      <mesh position={[0.1, 0.72, 0.06]} castShadow>
        <sphereGeometry args={[0.2, 16, 12]} />
        <meshStandardMaterial color="#3d5e42" roughness={0.9} />
      </mesh>
      <mesh position={[-0.08, 0.7, -0.04]} castShadow>
        <sphereGeometry args={[0.16, 14, 12]} />
        <meshStandardMaterial color="#243f2c" roughness={0.9} />
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
  const wall = useStaticMaterial('stucco', '#d6cec2', { roughness: 0.88, repeat: [3.4, 2.3] })
  const floor = useStaticMaterial('stone', '#9b9388', { roughness: 0.7, metalness: 0.08, repeat: [6, 6] })
  const interior = useStaticMaterial('interior', '#6e5a48', { roughness: 0.74, repeat: [2, 2] })
  const innerFloor = useStaticMaterial('walnut', '#4a3426', { roughness: 0.48, repeat: [3, 4] })
  const surround = useStaticMaterial('stone', '#b7aea2', { roughness: 0.76, repeat: [1.4, 2.2] })

  const wallW = 7.6
  const wallH = 3.4
  const wallT = 0.3
  const openW = openingWidth + 0.28
  const openH = openingHeight + 0.18
  const side = (wallW - openW) / 2

  return (
    <group>
      <mesh material={floor} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 2.4]} receiveShadow>
        <planeGeometry args={[16, 11]} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.004, 0.55]}>
        <circleGeometry args={[1.6, 40]} />
        <meshBasicMaterial color="#161310" transparent opacity={0.22} />
      </mesh>
      <mesh material={innerFloor} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, -2.2]} receiveShadow>
        <planeGeometry args={[5.6, 4.6]} />
      </mesh>

      <mesh material={wall} position={[-(openW / 2 + side / 2), wallH / 2, -wallT / 2]} receiveShadow castShadow>
        <boxGeometry args={[side, wallH, wallT]} />
      </mesh>
      <mesh material={wall} position={[openW / 2 + side / 2, wallH / 2, -wallT / 2]} receiveShadow castShadow>
        <boxGeometry args={[side, wallH, wallT]} />
      </mesh>
      <mesh material={wall} position={[0, openH + (wallH - openH) / 2, -wallT / 2]} receiveShadow castShadow>
        <boxGeometry args={[openW, Math.max(0.22, wallH - openH), wallT]} />
      </mesh>

      <mesh material={surround} position={[-(openW / 2 + 0.07), openH / 2, 0.02]} castShadow receiveShadow>
        <boxGeometry args={[0.14, openH + 0.14, 0.08]} />
      </mesh>
      <mesh material={surround} position={[openW / 2 + 0.07, openH / 2, 0.02]} castShadow receiveShadow>
        <boxGeometry args={[0.14, openH + 0.14, 0.08]} />
      </mesh>
      <mesh material={surround} position={[0, openH + 0.07, 0.02]} castShadow>
        <boxGeometry args={[openW + 0.28, 0.14, 0.08]} />
      </mesh>

      <mesh material={interior} position={[0, 1.45, -4.25]} receiveShadow>
        <boxGeometry args={[5.4, 2.9, 0.12]} />
      </mesh>
      <mesh material={interior} position={[-2.65, 1.45, -2.25]} receiveShadow>
        <boxGeometry args={[0.12, 2.9, 4.1]} />
      </mesh>
      <mesh material={interior} position={[2.65, 1.45, -2.25]} receiveShadow>
        <boxGeometry args={[0.12, 2.9, 4.1]} />
      </mesh>
      <mesh position={[0, 2.9, -2.2]} receiveShadow>
        <boxGeometry args={[5.5, 0.08, 4.3]} />
        <meshStandardMaterial color="#2a231c" roughness={0.82} />
      </mesh>
      <mesh position={[0, 0.42, -3.35]} castShadow>
        <boxGeometry args={[1.1, 0.84, 0.32]} />
        <meshStandardMaterial color="#3a2c22" roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.55, -4.16]}>
        <boxGeometry args={[0.7, 0.9, 0.04]} />
        <meshStandardMaterial color="#cfc3ae" roughness={0.55} />
      </mesh>

      <mesh position={[0, 3.46, 0.62]} castShadow>
        <boxGeometry args={[4.8, 0.1, 1.7]} />
        <meshStandardMaterial color="#efe7db" roughness={0.68} />
      </mesh>
      <mesh position={[-2.45, 2.92, 0.55]} castShadow>
        <boxGeometry args={[0.12, 1.18, 1.55]} />
        <meshStandardMaterial color="#efe7db" roughness={0.68} />
      </mesh>
      <mesh position={[2.45, 2.92, 0.55]} castShadow>
        <boxGeometry args={[0.12, 1.18, 1.55]} />
        <meshStandardMaterial color="#efe7db" roughness={0.68} />
      </mesh>
      <mesh position={[0, 3.38, 0.2]}>
        <cylinderGeometry args={[0.06, 0.08, 0.05, 16]} />
        <meshStandardMaterial
          color={night ? '#ffe1b0' : '#f4efe4'}
          emissive={night ? '#ffc27a' : '#000000'}
          emissiveIntensity={night ? 1.6 : 0}
        />
      </mesh>

      <mesh position={[-1.28, 1.58, 0.04]} castShadow>
        <boxGeometry args={[0.32, 0.42, 0.05]} />
        <meshStandardMaterial color="#1d1d20" metalness={0.45} roughness={0.38} />
      </mesh>
      <mesh position={[-1.28, 1.58, 0.068]}>
        <boxGeometry args={[0.22, 0.14, 0.012]} />
        <meshStandardMaterial color="#d7c27a" metalness={0.62} roughness={0.32} />
      </mesh>
      <mesh position={[-1.28, 1.2, 0.05]} castShadow>
        <cylinderGeometry args={[0.018, 0.018, 0.04, 12]} />
        <meshStandardMaterial color="#c4a574" metalness={0.7} roughness={0.3} />
      </mesh>

      <Sconce position={[-1.72, 2.18, 0.1]} lit={night} />
      <Sconce position={[1.72, 2.18, 0.1]} lit={night} />
      <Planter position={[-2.28, 0, 1.22]} />
      <Planter position={[2.28, 0, 1.22]} />

      {night ? <pointLight position={[0, 1.55, -2.5]} intensity={5} distance={6.5} color="#ffcf9a" /> : null}
    </group>
  )
}
