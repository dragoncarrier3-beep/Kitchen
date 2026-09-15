import { useMemo } from 'react'
import * as THREE from 'three'
import { getTextureBundle, materialKeyFromKind } from '../lib/textures'
import type { FrameFinish, MaterialFinish } from '../adapters/types'

const shared: {
  door: Map<string, THREE.MeshStandardMaterial>
  frame: Map<string, THREE.MeshStandardMaterial>
} = {
  door: new Map(),
  frame: new Map(),
}

function buildFinishMaterial(finish: MaterialFinish | FrameFinish, repeat: [number, number]): THREE.MeshStandardMaterial {
  try {
    const key = materialKeyFromKind(finish.textureKind, finish.id, finish.sku, finish.name)
    const bundle = getTextureBundle(key)
    const map = bundle.map.clone()
    const roughnessMap = bundle.roughnessMap.clone()
    const normalMap = bundle.normalMap.clone()
    map.repeat.set(repeat[0], repeat[1])
    roughnessMap.repeat.set(repeat[0], repeat[1])
    normalMap.repeat.set(repeat[0], repeat[1])
    map.needsUpdate = true
    roughnessMap.needsUpdate = true
    normalMap.needsUpdate = true
    return new THREE.MeshStandardMaterial({
      color: finish.textureKind === 'paint' ? new THREE.Color(finish.baseColor) : new THREE.Color('#ffffff'),
      map,
      roughnessMap,
      normalMap,
      metalness: finish.metalness,
      roughness: finish.roughness,
      envMapIntensity: 1.05,
      normalScale: new THREE.Vector2(0.55, 0.55),
    })
  } catch {
    return new THREE.MeshStandardMaterial({
      color: finish.baseColor,
      metalness: finish.metalness,
      roughness: finish.roughness,
    })
  }
}

export function useDoorMaterial(finish: MaterialFinish): THREE.MeshStandardMaterial {
  return useMemo(() => {
    const cached = shared.door.get(finish.id)
    if (cached) return cached
    const mat = buildFinishMaterial(finish, [1.1, 2.4])
    shared.door.set(finish.id, mat)
    return mat
  }, [finish])
}

export function useFrameMaterial(finish: FrameFinish): THREE.MeshStandardMaterial {
  return useMemo(() => {
    const cached = shared.frame.get(finish.id)
    if (cached) return cached
    const mat = buildFinishMaterial(finish, [0.6, 2.2])
    shared.frame.set(finish.id, mat)
    return mat
  }, [finish])
}

export function useStaticMaterial(
  key: string,
  color: string,
  opts?: { roughness?: number; metalness?: number; repeat?: [number, number] },
): THREE.MeshStandardMaterial {
  return useMemo(() => {
    try {
      const bundle = getTextureBundle(key)
      const map = bundle.map.clone()
      const roughnessMap = bundle.roughnessMap.clone()
      const normalMap = bundle.normalMap.clone()
      const repeat = opts?.repeat ?? [2, 2]
      map.repeat.set(repeat[0], repeat[1])
      roughnessMap.repeat.set(repeat[0], repeat[1])
      normalMap.repeat.set(repeat[0], repeat[1])
      return new THREE.MeshStandardMaterial({
        color,
        map,
        roughnessMap,
        normalMap,
        roughness: opts?.roughness ?? 0.7,
        metalness: opts?.metalness ?? 0.04,
        envMapIntensity: 0.85,
      })
    } catch {
      return new THREE.MeshStandardMaterial({
        color,
        roughness: opts?.roughness ?? 0.7,
        metalness: opts?.metalness ?? 0.04,
      })
    }
  }, [key, color, opts?.roughness, opts?.metalness, opts?.repeat?.[0], opts?.repeat?.[1]])
}
