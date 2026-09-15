import { AnimatePresence, motion } from 'framer-motion'
import { formatCurrency, formatDimensions, stockLabel } from '../lib/format'
import {
  buildConfigurationPayload,
  getAvailability,
  getQuoteFromState,
  getSelectedEntities,
  useConfiguratorStore,
} from '../store/configuratorStore'

export function SummaryCard() {
  const state = useConfiguratorStore()
  const { configuredMaterial, frame, handle, product } = getSelectedEntities(state)
  const quote = getQuoteFromState(state)
  const availability = getAvailability(state)
  const payload = buildConfigurationPayload(state)

  return (
    <section className="rounded-xl border border-white/10 bg-[#121214] p-4">
      <p className="text-[11px] tracking-[0.22em] text-[#c4a574] uppercase">Your Configuration</p>
      <dl className="mt-3 space-y-1.5 text-sm">
        <Row label="Model" value={product.name} />
        <Row label="Door Finish" value={configuredMaterial.name} />
        <Row label="Frame" value={frame.name} />
        <Row label="Handle" value={handle.name} />
        <Row label="Dimensions" value={formatDimensions(state.widthMm, state.heightMm)} />
        <Row label="Door SKU" value={payload.baseSku} />
        <Row label="Finish SKU" value={payload.material.sku} />
        <Row label="Handle SKU" value={payload.handle.sku} />
        <Row label="Availability" value={stockLabel(availability)} />
      </dl>
      <div className="mt-4 flex items-end justify-between border-t border-white/10 pt-3">
        <span className="text-xs tracking-widest text-[#9a9388] uppercase">Estimated Price</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={quote.total}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="font-display text-3xl text-[#f4efe6]"
          >
            {formatCurrency(quote.total)}
          </motion.span>
        </AnimatePresence>
      </div>
    </section>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-[#8a847b]">{label}</dt>
      <dd className="text-right text-[#f4efe6]">{value}</dd>
    </div>
  )
}
