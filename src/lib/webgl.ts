export type WebGLSupport = {
  available: boolean
  reason?: string
}

export function detectWebGL(): WebGLSupport {
  try {
    const canvas = document.createElement('canvas')
    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl')
    if (!gl) {
      return { available: false, reason: 'WebGL context could not be created.' }
    }
    return { available: true }
  } catch {
    return { available: false, reason: 'WebGL is blocked in this browser.' }
  }
}
