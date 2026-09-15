export function ResetDialog({
  open,
  onCancel,
  onConfirm,
}: {
  open: boolean
  onCancel: () => void
  onConfirm: () => void
}) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 p-4" role="dialog" aria-modal>
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#141416] p-6">
        <h2 className="font-display text-2xl text-[#f4efe6]">Reset configuration?</h2>
        <p className="mt-2 text-sm text-[#9a9388]">
          This restores the default Modern Entrance Door, Natural Oak, Matte Black frame, Modern Black Lever, 900 ×
          2100 mm, day lighting, and a closed door.
        </p>
        <div className="mt-5 flex gap-3">
          <button type="button" className="btn-primary" onClick={onConfirm}>
            Reset
          </button>
          <button type="button" className="btn-ghost" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
