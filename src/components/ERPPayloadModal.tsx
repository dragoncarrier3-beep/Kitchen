import { getERPAdapter } from '../adapters'
import { formatCurrency, formatDimensions } from '../lib/format'
import { buildConfigurationPayload, useConfiguratorStore } from '../store/configuratorStore'

export function ERPPayloadModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const payload = useConfiguratorStore((state) => buildConfigurationPayload(state))
  const adapter = getERPAdapter()

  if (!open) return null

  const rows = [
    ['Product SKU', payload.baseSku],
    ['Finish SKU', payload.material.sku],
    ['Frame SKU', payload.frame.sku],
    ['Handle SKU', payload.handle.sku],
    ['Width', `${payload.widthMm} mm`],
    ['Height', `${payload.heightMm} mm`],
    ['Quantity', String(payload.quantity)],
    ['Calculated price', formatCurrency(payload.price)],
    ['Dimensions', formatDimensions(payload.widthMm, payload.heightMm)],
    ['Configuration ID', payload.configurationId],
  ]

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal>
      <div className="max-h-[90vh] w-full max-w-xl overflow-auto rounded-2xl border border-white/10 bg-[#141416] p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] tracking-[0.24em] text-[#c4a574] uppercase">{adapter.providerLabel}</p>
            <h2 className="font-display mt-1 text-3xl text-[#f4efe6]">ERP Payload</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-md px-2 py-1 text-sm text-[#9a9388] hover:text-white">
            Close
          </button>
        </div>
        <p className="mt-3 text-sm text-[#9a9388]">
          Priority ERP connection will be enabled during the integration phase.
        </p>
        <dl className="mt-5 space-y-2 text-sm">
          {rows.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 border-b border-white/5 py-1.5">
              <dt className="text-[#8a847b]">{label}</dt>
              <dd className="font-mono text-[#f4efe6]">{value}</dd>
            </div>
          ))}
        </dl>
        <pre className="mt-5 overflow-auto rounded-lg bg-black/40 p-3 text-[11px] leading-5 text-[#d7cfc3]">
          {JSON.stringify(payload, null, 2)}
        </pre>
      </div>
    </div>
  )
}
