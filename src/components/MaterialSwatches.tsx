import { useState } from 'react'
import type { MaterialFinish } from '../adapters/types'
import { formatSignedCurrency, stockLabel } from '../lib/format'
import { getThumbnail, materialKeyFromKind } from '../lib/textures'

export function MaterialSwatches({
  items,
  selectedId,
  onSelect,
}: {
  items: MaterialFinish[]
  selectedId: string
  onSelect: (id: string) => void
}) {
  const [hoverId, setHoverId] = useState<string | null>(null)

  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((item) => {
        const active = item.id === selectedId
        const thumb = item.thumbnail || getThumbnail(materialKeyFromKind(item.textureKind, item.id, item.sku, item.name))
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            onMouseEnter={() => setHoverId(item.id)}
            onMouseLeave={() => setHoverId(null)}
            className={`relative overflow-hidden rounded-lg border text-left transition ${
              active ? 'border-[#c4a574] ring-1 ring-[#c4a574]/40' : 'border-white/10 hover:border-white/25'
            }`}
            aria-pressed={active}
          >
            <span className="block h-14 w-full" style={{ backgroundColor: item.baseColor }}>
              {thumb ? (
                <img
                  src={thumb}
                  alt=""
                  className="h-full w-full object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = 'none'
                  }}
                />
              ) : null}
            </span>
            <span className="block px-2 py-1.5">
              <span className="block text-[13px] text-[#f4efe6]">{item.name}</span>
              <span className="block text-[11px] text-[#9a9388]">
                {formatSignedCurrency(item.priceAdjustment)} · {stockLabel(item.stockStatus)}
              </span>
            </span>
            {hoverId === item.id ? (
              <span className="pointer-events-none absolute -left-1 -top-20 z-20 w-36 overflow-hidden rounded-md border border-white/10 bg-[#1b1b1e] shadow-xl">
                <span className="block h-20" style={{ backgroundColor: item.baseColor }}>
                  {thumb ? <img src={thumb} alt="" className="h-full w-full object-cover" /> : null}
                </span>
                <span className="block px-2 py-1 text-[11px] text-[#cfc6b8]">{item.sku}</span>
              </span>
            ) : null}
          </button>
        )
      })}
    </div>
  )
}
