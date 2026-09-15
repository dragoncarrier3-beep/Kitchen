import type { ReactNode } from 'react'

export function WebGLFallback({ children }: { children?: ReactNode }) {
  return (
    <div className="relative flex h-full min-h-[320px] items-end overflow-hidden bg-[#1a1714]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,#3a342c,transparent_55%)]" />
      <svg viewBox="0 0 400 520" className="absolute inset-x-0 top-8 mx-auto h-[78%] w-auto opacity-90" aria-hidden>
        <rect x="70" y="40" width="260" height="440" rx="4" fill="#2b2723" />
        <rect x="92" y="62" width="216" height="396" fill="#c4a06a" />
        <rect x="240" y="90" width="48" height="300" fill="#8fb0c0" opacity="0.45" />
        <rect x="268" y="250" width="22" height="10" rx="2" fill="#1a1a1c" />
      </svg>
      <div className="relative z-10 w-full bg-gradient-to-t from-[#0c0c0d] to-transparent p-6">
        <p className="font-display text-2xl text-[#f4efe6]">Interactive 3D preview is unavailable on this device.</p>
        <p className="mt-2 max-w-md text-sm text-[#9a9388]">
          You can still configure finishes, dimensions, hardware, and review the ERP-ready specification.
        </p>
        {children}
      </div>
    </div>
  )
}
