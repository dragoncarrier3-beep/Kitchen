import { formatCurrency, formatDimensions, stockLabel } from '../lib/format'
import { captureViewportImage } from '../lib/snapshot'
import {
  buildConfigurationPayload,
  getAvailability,
  getQuoteFromState,
  getSelectedEntities,
  useConfiguratorStore,
} from '../store/configuratorStore'

export function SpecSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const state = useConfiguratorStore()
  if (!open) return null

  const { configuredMaterial, frame, handle, product } = getSelectedEntities(state)
  const quote = getQuoteFromState(state)
  const payload = buildConfigurationPayload(state)
  const snapshot = captureViewportImage()
  const availability = stockLabel(getAvailability(state))

  const printSpec = () => {
    window.print()
  }

  const downloadPdf = async () => {
    const { jsPDF } = await import('jspdf')
    const doc = new jsPDF({ unit: 'pt', format: 'a4' })
    doc.setFillColor(12, 12, 13)
    doc.rect(0, 0, 595, 90, 'F')
    doc.setTextColor(196, 165, 116)
    doc.setFontSize(11)
    doc.text('DOORCRAFT', 40, 36)
    doc.setTextColor(244, 239, 230)
    doc.setFontSize(22)
    doc.text('Entrance Door Specification', 40, 62)
    doc.setTextColor(90, 90, 90)
    doc.setFontSize(10)
    doc.text(payload.configurationId, 400, 62)

    if (snapshot) {
      try {
        doc.addImage(snapshot, 'JPEG', 40, 110, 240, 180)
      } catch {
        doc.setFillColor(30, 30, 32)
        doc.rect(40, 110, 240, 180, 'F')
      }
    }

    const lines: Array<[string, string]> = [
      ['Product', product.name],
      ['Door material', configuredMaterial.name],
      ['Frame', frame.name],
      ['Handle', handle.name],
      ['Dimensions', formatDimensions(state.widthMm, state.heightMm)],
      ['Door SKU', payload.baseSku],
      ['Finish SKU', payload.material.sku],
      ['Frame SKU', payload.frame.sku],
      ['Handle SKU', payload.handle.sku],
      ['Stock status', availability],
      ['Estimated price', formatCurrency(quote.total)],
      ['Configuration ID', payload.configurationId],
    ]

    let y = 110
    doc.setFontSize(11)
    for (const [label, value] of lines) {
      doc.setTextColor(120, 114, 106)
      doc.text(label, 300, y)
      doc.setTextColor(20, 20, 22)
      doc.text(String(value), 300, y + 14)
      y += 32
    }

    doc.setFontSize(9)
    doc.setTextColor(140, 140, 140)
    doc.text('Phase 1 POC — pricing and SKUs from Demo ERP Provider. Not a live Priority ERP order.', 40, 800)
    doc.save(`${payload.configurationId}.pdf`)
  }

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 print:static print:bg-white" role="dialog">
      <div
        id="spec-sheet"
        className="max-h-[92vh] w-full max-w-3xl overflow-auto rounded-2xl border border-white/10 bg-[#141416] p-6 text-[#f4efe6] shadow-2xl print:max-h-none print:border-0 print:bg-white print:text-black print:shadow-none"
      >
        <div className="no-print flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] tracking-[0.24em] text-[#c4a574] uppercase">DoorCraft</p>
            <h2 className="font-display mt-1 text-3xl">Specification Sheet</h2>
          </div>
          <button type="button" onClick={onClose} className="text-sm text-[#9a9388] hover:text-white">
            Close
          </button>
        </div>
        <div className="mt-5 grid gap-5 md:grid-cols-[1.1fr_0.9fr]">
          <div className="overflow-hidden rounded-xl bg-black/30">
            {snapshot ? (
              <img src={snapshot} alt="Configured entrance door" className="w-full object-cover" />
            ) : (
              <div className="flex h-48 items-center justify-center text-sm text-[#9a9388]">Preview snapshot unavailable</div>
            )}
          </div>
          <dl className="space-y-2 text-sm">
            <SpecRow label="Product" value={product.name} />
            <SpecRow label="Door material" value={configuredMaterial.name} />
            <SpecRow label="Frame" value={frame.name} />
            <SpecRow label="Handle" value={handle.name} />
            <SpecRow label="Dimensions" value={formatDimensions(state.widthMm, state.heightMm)} />
            <SpecRow label="Door SKU" value={payload.baseSku} />
            <SpecRow label="Finish SKU" value={payload.material.sku} />
            <SpecRow label="Handle SKU" value={payload.handle.sku} />
            <SpecRow label="Stock status" value={availability} />
            <SpecRow label="Estimated price" value={formatCurrency(quote.total)} />
            <SpecRow label="Configuration ID" value={payload.configurationId} />
          </dl>
        </div>
        <div className="no-print mt-6 flex gap-3">
          <button type="button" onClick={printSpec} className="btn-primary">
            Print
          </button>
          <button type="button" className="btn-ghost" onClick={() => void downloadPdf()}>
            Download PDF
          </button>
        </div>
      </div>
    </div>
  )
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-white/10 py-1 print:border-neutral-200">
      <dt className="text-[#8a847b] print:text-neutral-500">{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}
