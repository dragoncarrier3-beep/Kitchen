import * as THREE from 'three'

export type TextureBundle = {
  map: THREE.CanvasTexture
  roughnessMap: THREE.CanvasTexture
  normalMap: THREE.CanvasTexture
  thumbnail: string
}

type PaintSpec = {
  base: [number, number, number]
  variation: number
  roughness: number
  grain?: boolean
}

type WoodSpec = {
  light: [number, number, number]
  mid: [number, number, number]
  dark: [number, number, number]
  pore: number
}

const SIZE = 256
const THUMB = 96

function hash(x: number, y: number): number {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return s - Math.floor(s)
}

function noise(x: number, y: number): number {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const xf = x - xi
  const yf = y - yi
  const u = xf * xf * (3 - 2 * xf)
  const v = yf * yf * (3 - 2 * yf)
  const a = hash(xi, yi)
  const b = hash(xi + 1, yi)
  const c = hash(xi, yi + 1)
  const d = hash(xi + 1, yi + 1)
  return a * (1 - u) * (1 - v) + b * u * (1 - v) + c * (1 - u) * v + d * u * v
}

function fbm(x: number, y: number, octaves = 5): number {
  let value = 0
  let amp = 0.5
  let freq = 1
  for (let i = 0; i < octaves; i += 1) {
    value += amp * noise(x * freq, y * freq)
    freq *= 2
    amp *= 0.5
  }
  return value
}

function clampByte(v: number): number {
  return Math.max(0, Math.min(255, Math.round(v)))
}

function mix(a: [number, number, number], b: [number, number, number], t: number): [number, number, number] {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t]
}

function makeCanvas(size: number): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D; data: ImageData } {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d', { willReadFrequently: true }) ?? canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas 2D is unavailable')
  const data = ctx.createImageData(size, size)
  return { canvas, ctx, data }
}

function solidCanvas(size: number, rgb: [number, number, number]): HTMLCanvasElement {
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.fillStyle = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
    ctx.fillRect(0, 0, size, size)
  }
  return canvas
}

function toTexture(canvas: HTMLCanvasElement, srgb: boolean): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.anisotropy = 8
  texture.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace
  texture.needsUpdate = true
  return texture
}

function paintWood(size: number, spec: WoodSpec): { color: HTMLCanvasElement; rough: HTMLCanvasElement; height: Float32Array } {
  const color = makeCanvas(size)
  const rough = makeCanvas(size)
  const height = new Float32Array(size * size)

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const nx = x / size
      const ny = y / size
      const warp = fbm(nx * 6, ny * 1.6, 3)
      const ring = Math.sin((nx * 18 + warp * 7) * Math.PI)
      const ringAbs = Math.abs(ring)
      const grain = fbm(nx * 40, ny * 3.5, 2)
      const fine = noise(nx * 120, ny * 14)
      let t = ringAbs * 0.55 + grain * 0.35 + fine * 0.1
      t = Math.max(0, Math.min(1, t))
      const midMix = mix(spec.light, spec.mid, t)
      const col = mix(midMix, spec.dark, Math.max(0, ringAbs - 0.55) * 1.4)
      const pores = fine > 0.82 ? spec.pore : 0
      const i = (y * size + x) * 4
      color.data.data[i] = clampByte(col[0] - pores * 40)
      color.data.data[i + 1] = clampByte(col[1] - pores * 30)
      color.data.data[i + 2] = clampByte(col[2] - pores * 22)
      color.data.data[i + 3] = 255
      const r = 110 + t * 90 + fine * 25
      rough.data.data[i] = clampByte(r)
      rough.data.data[i + 1] = clampByte(r)
      rough.data.data[i + 2] = clampByte(r)
      rough.data.data[i + 3] = 255
      height[y * size + x] = t * 0.55 + fine * 0.12
    }
  }
  color.ctx.putImageData(color.data, 0, 0)
  rough.ctx.putImageData(rough.data, 0, 0)
  return { color: color.canvas, rough: rough.canvas, height }
}

function paintSolid(size: number, spec: PaintSpec): { color: HTMLCanvasElement; rough: HTMLCanvasElement; height: Float32Array } {
  const color = makeCanvas(size)
  const rough = makeCanvas(size)
  const height = new Float32Array(size * size)
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const nx = x / size
      const ny = y / size
      const n = fbm(nx * 8, ny * 8, 4)
      const streak = spec.grain ? fbm(nx * 90, ny * 4, 3) : n
      const delta = (streak - 0.5) * spec.variation
      const i = (y * size + x) * 4
      color.data.data[i] = clampByte(spec.base[0] + delta * 18)
      color.data.data[i + 1] = clampByte(spec.base[1] + delta * 18)
      color.data.data[i + 2] = clampByte(spec.base[2] + delta * 16)
      color.data.data[i + 3] = 255
      const r = spec.roughness * 255 + (n - 0.5) * 28
      rough.data.data[i] = clampByte(r)
      rough.data.data[i + 1] = clampByte(r)
      rough.data.data[i + 2] = clampByte(r)
      rough.data.data[i + 3] = 255
      height[y * size + x] = n * 0.08 + (spec.grain ? streak * 0.12 : 0)
    }
  }
  color.ctx.putImageData(color.data, 0, 0)
  rough.ctx.putImageData(rough.data, 0, 0)
  return { color: color.canvas, rough: rough.canvas, height }
}

function heightToNormal(height: Float32Array, size: number): HTMLCanvasElement {
  const { canvas, ctx, data } = makeCanvas(size)
  const strength = 6
  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      const l = height[y * size + ((x - 1 + size) % size)]
      const r = height[y * size + ((x + 1) % size)]
      const u = height[((y - 1 + size) % size) * size + x]
      const d = height[((y + 1) % size) * size + x]
      const dx = (l - r) * strength
      const dy = (u - d) * strength
      const dz = 1
      const len = Math.hypot(dx, dy, dz) || 1
      const i = (y * size + x) * 4
      data.data[i] = clampByte(((dx / len) * 0.5 + 0.5) * 255)
      data.data[i + 1] = clampByte(((dy / len) * 0.5 + 0.5) * 255)
      data.data[i + 2] = clampByte(((dz / len) * 0.5 + 0.5) * 255)
      data.data[i + 3] = 255
    }
  }
  ctx.putImageData(data, 0, 0)
  return canvas
}

function bundleFromMaps(color: HTMLCanvasElement, rough: HTMLCanvasElement, height: Float32Array): TextureBundle {
  const normal = heightToNormal(height, color.width)
  const thumbCanvas = document.createElement('canvas')
  thumbCanvas.width = THUMB
  thumbCanvas.height = THUMB
  const tctx = thumbCanvas.getContext('2d')
  tctx?.drawImage(color, 0, 0, THUMB, THUMB)
  return {
    map: toTexture(color, true),
    roughnessMap: toTexture(rough, false),
    normalMap: toTexture(normal, false),
    thumbnail: thumbCanvas.toDataURL('image/png'),
  }
}

const WOOD: Record<string, WoodSpec> = {
  oak: { light: [214, 176, 118], mid: [176, 128, 72], dark: [120, 78, 40], pore: 0.35 },
  walnut: { light: [118, 78, 48], mid: [82, 50, 30], dark: [42, 24, 14], pore: 0.45 },
}

const PAINT: Record<string, PaintSpec> = {
  black: { base: [26, 26, 28], variation: 0.35, roughness: 0.74 },
  anthracite: { base: [60, 65, 72], variation: 0.4, roughness: 0.56 },
  white: { base: [239, 230, 214], variation: 0.28, roughness: 0.62 },
  metal: { base: [183, 179, 171], variation: 0.7, roughness: 0.28, grain: true },
  stucco: { base: [214, 206, 194], variation: 0.55, roughness: 0.82 },
  stone: { base: [168, 160, 148], variation: 0.8, roughness: 0.7 },
  interior: { base: [92, 78, 64], variation: 0.3, roughness: 0.68 },
}

let library: Record<string, TextureBundle> | null = null
let fallback: TextureBundle | null = null
let initPromise: Promise<void> | null = null

function safeFallback(): TextureBundle {
  if (fallback) return fallback
  try {
    const painted = paintSolid(64, PAINT.stucco)
    fallback = bundleFromMaps(painted.color, painted.rough, painted.height)
  } catch {
    const canvas = solidCanvas(8, [180, 170, 158])
    fallback = {
      map: toTexture(canvas, true),
      roughnessMap: toTexture(canvas, false),
      normalMap: toTexture(solidCanvas(8, [128, 128, 255]), false),
      thumbnail: canvas.toDataURL('image/png'),
    }
  }
  return fallback
}

export async function initTextureLibrary(onProgress?: (value: number) => void): Promise<void> {
  if (library && Object.keys(library).length > 0) {
    onProgress?.(1)
    return
  }
  if (initPromise) {
    await initPromise
    onProgress?.(1)
    return
  }

  initPromise = (async () => {
    onProgress?.(0.06)
    await new Promise((resolve) => setTimeout(resolve, 0))
  const jobs: Array<[string, () => TextureBundle]> = [
    ['oak', () => {
      const w = paintWood(SIZE, WOOD.oak)
      return bundleFromMaps(w.color, w.rough, w.height)
    }],
    ['walnut', () => {
      const w = paintWood(SIZE, WOOD.walnut)
      return bundleFromMaps(w.color, w.rough, w.height)
    }],
    ['black', () => {
      const p = paintSolid(SIZE, PAINT.black)
      return bundleFromMaps(p.color, p.rough, p.height)
    }],
    ['anthracite', () => {
      const p = paintSolid(SIZE, PAINT.anthracite)
      return bundleFromMaps(p.color, p.rough, p.height)
    }],
    ['white', () => {
      const p = paintSolid(SIZE, PAINT.white)
      return bundleFromMaps(p.color, p.rough, p.height)
    }],
    ['metal', () => {
      const p = paintSolid(SIZE, PAINT.metal)
      return bundleFromMaps(p.color, p.rough, p.height)
    }],
    ['stucco', () => {
      const p = paintSolid(SIZE, PAINT.stucco)
      return bundleFromMaps(p.color, p.rough, p.height)
    }],
    ['stone', () => {
      const p = paintSolid(SIZE, PAINT.stone)
      return bundleFromMaps(p.color, p.rough, p.height)
    }],
    ['interior', () => {
      const p = paintSolid(256, PAINT.interior)
      return bundleFromMaps(p.color, p.rough, p.height)
    }],
  ]

    const maps: Record<string, TextureBundle> = {}
    for (let i = 0; i < jobs.length; i += 1) {
      const [key, job] = jobs[i]
      try {
        maps[key] = job()
      } catch {
        maps[key] = safeFallback()
      }
      onProgress?.((i + 1) / jobs.length)
      await new Promise((resolve) => setTimeout(resolve, 0))
    }
    library = maps
  })()

  await initPromise
}

export function getTextureBundle(key: string): TextureBundle {
  return library?.[key] ?? safeFallback()
}

export function getThumbnail(key: string): string {
  return getTextureBundle(key).thumbnail
}

export function materialKeyFromKind(
  kind: string,
  id: string,
  sku = '',
  name = '',
): string {
  if (kind === 'oak') return 'oak'
  if (kind === 'walnut') return 'walnut'
  if (kind === 'metal') return 'metal'
  const hay = `${id} ${sku} ${name}`.toUpperCase()
  if (hay.includes('OAK')) return 'oak'
  if (hay.includes('WAL')) return 'walnut'
  if (hay.includes('MTL') || hay.includes('METAL')) return 'metal'
  if (hay.includes('BLK') || hay.includes('BLACK')) return 'black'
  if (hay.includes('ANT')) return 'anthracite'
  if (hay.includes('WHT') || hay.includes('WHITE')) return 'white'
  return 'stucco'
}

export function disposeTextureLibrary(): void {
  if (!library) return
  for (const bundle of Object.values(library)) {
    bundle.map.dispose()
    bundle.roughnessMap.dispose()
    bundle.normalMap.dispose()
  }
  library = null
}

let studioEnv: THREE.CubeTexture | null = null

export function getStudioEnvironment(): THREE.CubeTexture {
  if (studioEnv) return studioEnv
  const face = (top: string, bottom: string) => {
    const canvas = document.createElement('canvas')
    canvas.width = 64
    canvas.height = 64
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const g = ctx.createLinearGradient(0, 0, 0, 64)
      g.addColorStop(0, top)
      g.addColorStop(1, bottom)
      ctx.fillStyle = g
      ctx.fillRect(0, 0, 64, 64)
    }
    return canvas
  }
  studioEnv = new THREE.CubeTexture([
    face('#e7edf3', '#c5ccd4'),
    face('#e4eaef', '#c2c9d1'),
    face('#f4f0e8', '#dce3ea'),
    face('#8d8578', '#5f584f'),
    face('#d8e0e8', '#b7c0c9'),
    face('#cfd6de', '#aeb6bf'),
  ])
  studioEnv.colorSpace = THREE.SRGBColorSpace
  studioEnv.needsUpdate = true
  return studioEnv
}
