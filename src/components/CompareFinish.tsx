import { useConfiguratorStore } from '../store/configuratorStore'

export function CompareFinish() {
  const enabled = useConfiguratorStore((s) => s.compareEnabled)
  const showing = useConfiguratorStore((s) => s.compareShowing)
  const setEnabled = useConfiguratorStore((s) => s.setCompareEnabled)
  const setShowing = useConfiguratorStore((s) => s.setCompareShowing)
  const materials = useConfiguratorStore((s) => s.materials)
  const a = materials.find((m) => m.id === 'MAT-001')
  const b = materials.find((m) => m.id === 'MAT-003')

  return (
    <div className="rounded-lg border border-white/10 p-3">
      <div className="flex items-center justify-between">
        <p className="text-[12px] tracking-widest text-[#9a9388] uppercase">Compare Finish</p>
        <button type="button" className="text-xs text-[#c4a574]" onClick={() => setEnabled(!enabled)}>
          {enabled ? 'Exit' : 'Enable'}
        </button>
      </div>
      {enabled ? (
        <div className="mt-3">
          <p className="text-sm text-[#f4efe6]">
            {a?.name ?? 'Natural Oak'} vs. {b?.name ?? 'Matte Black'}
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setShowing('a')}
              className={`rounded-md px-3 py-2 text-sm ${showing === 'a' ? 'bg-[#c4a574] text-[#1a140c]' : 'bg-white/5 text-[#f4efe6]'}`}
            >
              Natural Oak
            </button>
            <button
              type="button"
              onClick={() => setShowing('b')}
              className={`rounded-md px-3 py-2 text-sm ${showing === 'b' ? 'bg-[#c4a574] text-[#1a140c]' : 'bg-white/5 text-[#f4efe6]'}`}
            >
              Matte Black
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-2 text-xs text-[#8a847b]">Rapid A/B swap for the real-time material engine.</p>
      )}
    </div>
  )
}
