import { useState, type ReactNode } from 'react'
import type { CameraPreset } from '../adapters/types'
import { formatDimensions } from '../lib/format'
import { CompareFinish } from './CompareFinish'
import { DimensionControls } from './DimensionControls'
import { MaterialSwatches } from './MaterialSwatches'
import { SummaryCard } from './SummaryCard'
import { useConfiguratorStore } from '../store/configuratorStore'

export function ConfigPanel({
  onReset,
  onErp,
  onSpec,
}: {
  onReset: () => void
  onErp: () => void
  onSpec: () => void
}) {
  const product = useConfiguratorStore((s) => s.product)
  const materials = useConfiguratorStore((s) => s.materials)
  const frames = useConfiguratorStore((s) => s.frames)
  const handles = useConfiguratorStore((s) => s.handles)
  const materialId = useConfiguratorStore((s) => s.materialId)
  const frameId = useConfiguratorStore((s) => s.frameId)
  const handleId = useConfiguratorStore((s) => s.handleId)
  const widthMm = useConfiguratorStore((s) => s.widthMm)
  const heightMm = useConfiguratorStore((s) => s.heightMm)
  const lighting = useConfiguratorStore((s) => s.lighting)
  const setMaterial = useConfiguratorStore((s) => s.setMaterial)
  const setFrame = useConfiguratorStore((s) => s.setFrame)
  const setHandle = useConfiguratorStore((s) => s.setHandle)
  const setWidth = useConfiguratorStore((s) => s.setWidth)
  const setHeight = useConfiguratorStore((s) => s.setHeight)
  const setLighting = useConfiguratorStore((s) => s.setLighting)

  const material = materials.find((item) => item.id === materialId)
  const frame = frames.find((item) => item.id === frameId)
  const handle = handles.find((item) => item.id === handleId)

  return (
    <aside className="flex h-full flex-col bg-[#101012] text-[#f4efe6]">
      <header className="border-b border-white/10 px-5 py-4">
        <p className="text-[11px] tracking-[0.34em] text-[#c4a574] uppercase">DoorCraft</p>
        <h1 className="font-display mt-1 text-[28px] leading-tight">Entrance Door Configurator</h1>
        <div className="mt-3 flex gap-2">
          <button type="button" className="btn-ghost" onClick={onReset}>
            Reset Configuration
          </button>
        </div>
      </header>

      <div className="flex-1 space-y-6 overflow-y-auto px-5 py-5">
        <Section title="Model" complete detail={product.name}>
          <p className="text-sm text-[#9a9388]">{product.description}</p>
          <p className="mt-2 font-mono text-xs text-[#c4a574]">{product.baseSku}</p>
        </Section>

        <Section title="Material" complete detail={material?.name}>
          <MaterialSwatches items={materials} selectedId={materialId} onSelect={setMaterial} />
          <div className="mt-3">
            <CompareFinish />
          </div>
        </Section>

        <Section title="Frame" complete detail={frame?.name}>
          <div className="grid grid-cols-2 gap-2">
            {frames.map((item) => {
              const thumb = item.thumbnail
              const active = item.id === frameId
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFrame(item.id)}
                  aria-pressed={active}
                  className={`overflow-hidden rounded-lg border text-left ${
                    active ? 'border-[#c4a574] ring-1 ring-[#c4a574]/40' : 'border-white/10'
                  }`}
                >
                  <span className="block h-10" style={{ backgroundColor: item.baseColor }}>
                    {thumb ? <img src={thumb} alt="" className="h-full w-full object-cover" /> : null}
                  </span>
                  <span className="block px-2 py-1.5 text-[13px]">{item.name}</span>
                </button>
              )
            })}
          </div>
        </Section>

        <Section title="Handle" complete detail={handle?.name}>
          <div className="space-y-2">
            {handles.map((item) => {
              const active = item.id === handleId
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setHandle(item.id)}
                  aria-pressed={active}
                  className={`flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-left ${
                    active ? 'border-[#c4a574] bg-[#c4a574]/10' : 'border-white/10 hover:border-white/25'
                  }`}
                >
                  <span>
                    <span className="block text-sm">{item.name}</span>
                    <span className="block font-mono text-[11px] text-[#9a9388]">{item.sku}</span>
                  </span>
                  <span className="text-sm text-[#c4a574]">{item.priceAdjustment ? `+$${item.priceAdjustment}` : '+$0'}</span>
                </button>
              )
            })}
          </div>
        </Section>

        <Section title="Dimensions" complete detail={formatDimensions(widthMm, heightMm)}>
          <DimensionControls widthMm={widthMm} heightMm={heightMm} onWidth={setWidth} onHeight={setHeight} />
        </Section>

        <Section title="Lighting" complete detail={lighting === 'day' ? 'Day' : 'Night'}>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              className={lighting === 'day' ? 'btn-primary' : 'btn-ghost'}
              onClick={() => setLighting('day')}
            >
              Day
            </button>
            <button
              type="button"
              className={lighting === 'night' ? 'btn-primary' : 'btn-ghost'}
              onClick={() => setLighting('night')}
            >
              Night
            </button>
          </div>
        </Section>

        <SummaryCard />

        <div className="grid grid-cols-1 gap-2 pb-6">
          <button type="button" className="btn-primary" onClick={onSpec}>
            Generate Specification
          </button>
          <button type="button" className="btn-ghost" onClick={onErp}>
            View ERP Payload
          </button>
        </div>
      </div>
    </aside>
  )
}

function Section({
  title,
  detail,
  complete,
  children,
}: {
  title: string
  detail?: string
  complete?: boolean
  children: ReactNode
}) {
  const [open, setOpen] = useState(true)
  return (
    <section>
      <button type="button" className="mb-3 flex w-full items-center justify-between" onClick={() => setOpen(!open)}>
        <span>
          <span className="block text-[11px] tracking-[0.24em] text-[#9a9388] uppercase">{title}</span>
          {detail ? <span className="mt-0.5 block text-sm text-[#f4efe6]">{detail}</span> : null}
        </span>
        <span className={`h-2 w-2 rounded-full ${complete ? 'bg-[#c4a574]' : 'bg-white/20'}`} />
      </button>
      {open ? children : null}
    </section>
  )
}

export function ViewportChrome() {
  const widthMm = useConfiguratorStore((s) => s.widthMm)
  const heightMm = useConfiguratorStore((s) => s.heightMm)
  const doorOpen = useConfiguratorStore((s) => s.doorOpen)
  const lighting = useConfiguratorStore((s) => s.lighting)
  const toggleDoor = useConfiguratorStore((s) => s.toggleDoor)
  const setLighting = useConfiguratorStore((s) => s.setLighting)
  const setCameraPreset = useConfiguratorStore((s) => s.setCameraPreset)

  const presets: Array<{ id: CameraPreset; label: string }> = [
    { id: 'front', label: 'Front' },
    { id: 'angle', label: 'Angle' },
    { id: 'handle', label: 'Handle Close-up' },
    { id: 'full', label: 'Full View' },
  ]

  return (
    <>
      <div className="pointer-events-none absolute left-4 right-4 top-4 z-10 flex items-start justify-between gap-3">
        <div>
          <p className="pointer-events-auto text-[11px] tracking-[0.3em] text-[#c4a574] uppercase drop-shadow">DoorCraft</p>
          <p className="font-display text-2xl text-white drop-shadow md:hidden">Entrance Door</p>
        </div>
        <p className="rounded-full bg-black/45 px-3 py-1 text-sm text-white backdrop-blur">
          {formatDimensions(widthMm, heightMm)}
        </p>
      </div>

      <div className="absolute bottom-4 left-4 right-4 z-10 flex flex-col gap-2 md:right-auto">
        <div className="flex flex-wrap gap-1.5">
          {presets.map((preset) => (
            <button key={preset.id} type="button" className="chip" onClick={() => setCameraPreset(preset.id)}>
              {preset.label}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          <button type="button" className="chip" onClick={toggleDoor}>
            {doorOpen ? 'Close Door' : 'Open Door'}
          </button>
          <button
            type="button"
            className={`chip ${lighting === 'day' ? 'chip-active' : ''}`}
            onClick={() => setLighting('day')}
          >
            Day
          </button>
          <button
            type="button"
            className={`chip ${lighting === 'night' ? 'chip-active' : ''}`}
            onClick={() => setLighting('night')}
          >
            Night
          </button>
        </div>
      </div>
    </>
  )
}
