import { useEffect, useMemo, useState } from 'react'
import { FRAME_FINISHES, MATERIALS } from './data/seed'
import { getThumbnail, initTextureLibrary, materialKeyFromKind } from './lib/textures'
import { detectWebGL } from './lib/webgl'
import { ConfigPanel } from './components/ConfigPanel'
import { ERPPayloadModal } from './components/ERPPayloadModal'
import { LoadingScreen } from './components/LoadingScreen'
import { ResetDialog } from './components/ResetDialog'
import { SpecSheet } from './components/SpecSheet'
import { Viewport } from './components/Viewport'
import { useConfiguratorStore } from './store/configuratorStore'

export default function App() {
  const [progress, setProgress] = useState(0)
  const [ready, setReady] = useState(false)
  const [erpOpen, setErpOpen] = useState(false)
  const [specOpen, setSpecOpen] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const [sheetOpen, setSheetOpen] = useState(false)
  const webgl = useMemo(() => detectWebGL().available, [])
  const reset = useConfiguratorStore((s) => s.reset)
  const hasChanges = useConfiguratorStore((s) => s.hasChanges)
  const hydrateCatalog = useConfiguratorStore((s) => s.hydrateCatalog)

  useEffect(() => {
    let cancelled = false
    const timeout = window.setTimeout(() => {
      if (!cancelled) setReady(true)
    }, 1800)

    initTextureLibrary((value) => {
      if (!cancelled) setProgress(Math.max(0.06, value))
    })
      .then(() => {
        if (cancelled) return
        try {
          const materials = MATERIALS.map((item) => ({
            ...item,
            thumbnail: getThumbnail(materialKeyFromKind(item.textureKind, item.id, item.sku, item.name)),
          }))
          const frames = FRAME_FINISHES.map((item) => ({
            ...item,
            thumbnail: getThumbnail(materialKeyFromKind(item.textureKind, item.id, item.sku, item.name)),
          }))
          hydrateCatalog({ materials, frames })
        } catch {
          /* seeded catalog already in the store */
        }
        setReady(true)
      })
      .catch(() => {
        if (!cancelled) setReady(true)
      })
    return () => {
      cancelled = true
      window.clearTimeout(timeout)
    }
  }, [hydrateCatalog])

  const requestReset = () => {
    if (hasChanges()) setResetOpen(true)
    else reset()
  }

  if (!ready) return <LoadingScreen progress={progress} />

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-[#0c0c0d] text-[#f4efe6] lg:grid lg:grid-cols-[minmax(0,1fr)_400px]">
      <div className={`${sheetOpen ? 'h-[40%]' : 'h-[56%]'} min-h-[260px] lg:h-full`}>
        <Viewport webgl={webgl} />
      </div>
      <div className="relative min-h-0 flex-1 border-t border-white/10 lg:border-l lg:border-t-0">
        <button
          type="button"
          className="absolute left-1/2 top-2 z-10 h-1.5 w-12 -translate-x-1/2 rounded-full bg-white/25 lg:hidden"
          aria-label="Toggle configuration panel"
          onClick={() => setSheetOpen((value) => !value)}
        />
        <div className="h-full overflow-hidden pt-3 lg:pt-0">
          <ConfigPanel onReset={requestReset} onErp={() => setErpOpen(true)} onSpec={() => setSpecOpen(true)} />
        </div>
      </div>
      {erpOpen ? <ERPPayloadModal onClose={() => setErpOpen(false)} /> : null}
      {specOpen ? <SpecSheet onClose={() => setSpecOpen(false)} /> : null}
      <ResetDialog
        open={resetOpen}
        onCancel={() => setResetOpen(false)}
        onConfirm={() => {
          reset()
          setResetOpen(false)
        }}
      />
    </div>
  )
}
