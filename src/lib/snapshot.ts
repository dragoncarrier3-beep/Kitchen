let captureFn: (() => string) | null = null

export function registerViewportCapture(fn: (() => string) | null): void {
  captureFn = fn
}

export function captureViewportImage(): string | null {
  try {
    return captureFn?.() ?? null
  } catch {
    return null
  }
}
