type Props = { progress: number }

export function LoadingScreen({ progress }: Props) {
  const pct = Math.max(0, Math.min(100, Math.round(progress * 100)))
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0c0c0d]">
      <div className="w-[min(420px,86vw)] text-center">
        <p className="text-[11px] tracking-[0.32em] text-[#c4a574] uppercase">DoorCraft</p>
        <h1 className="font-display mt-3 text-4xl text-[#f4efe6]">Preparing your configurator…</h1>
        <p className="mt-3 text-sm text-[#9a9388]">Loading materials, lighting, and the entrance door scene.</p>
        <div className="mt-8 h-[2px] overflow-hidden bg-[#2a2a2e]">
          <div className="h-full bg-[#c4a574] transition-[width] duration-200" style={{ width: `${pct}%` }} />
        </div>
        <p className="mt-3 text-xs tracking-widest text-[#6f6a63]">{pct}%</p>
      </div>
    </div>
  )
}
