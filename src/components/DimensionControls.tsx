import { DEFAULTS } from '../data/seed'
import { clamp } from '../lib/format'

export function DimensionControls({
  widthMm,
  heightMm,
  onWidth,
  onHeight,
}: {
  widthMm: number
  heightMm: number
  onWidth: (value: number) => void
  onHeight: (value: number) => void
}) {
  return (
    <div className="space-y-4">
      <NumberSlider
        label="Width"
        value={widthMm}
        min={DEFAULTS.minWidthMm}
        max={DEFAULTS.maxWidthMm}
        onChange={onWidth}
      />
      <NumberSlider
        label="Height"
        value={heightMm}
        min={DEFAULTS.minHeightMm}
        max={DEFAULTS.maxHeightMm}
        onChange={onHeight}
      />
    </div>
  )
}

function NumberSlider({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  onChange: (value: number) => void
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-center justify-between text-[12px] text-[#9a9388]">
        <span>{label}</span>
        <span className="text-[#f4efe6]">{value} mm</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={10}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full accent-[#c4a574]"
      />
      <input
        type="number"
        min={min}
        max={max}
        step={10}
        value={value}
        onChange={(event) => onChange(clamp(Number(event.target.value) || min, min, max))}
        className="mt-2 w-full rounded-md border border-white/10 bg-[#0e0e10] px-2 py-1.5 text-sm text-[#f4efe6] outline-none focus:border-[#c4a574]"
      />
    </label>
  )
}
