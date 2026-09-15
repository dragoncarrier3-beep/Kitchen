import type { StockStatus } from '../adapters/types'

export function formatCurrency(amount: number, currency = 'USD'): string {
  if (!Number.isFinite(amount)) return '$0'
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatSignedCurrency(amount: number): string {
  if (!Number.isFinite(amount) || amount === 0) return '+$0'
  const abs = formatCurrency(Math.abs(amount))
  return amount > 0 ? `+${abs}` : `-${abs}`
}

export function formatDimensions(widthMm: number, heightMm: number): string {
  const w = Number.isFinite(widthMm) ? Math.round(widthMm) : 0
  const h = Number.isFinite(heightMm) ? Math.round(heightMm) : 0
  return `${w} mm × ${h} mm`
}

export function stockLabel(status: StockStatus): string {
  switch (status) {
    case 'in_stock':
      return 'In Stock'
    case 'low_stock':
      return 'Low Stock'
    case 'made_to_order':
      return 'Made to Order'
    case 'out_of_stock':
      return 'Out of Stock'
    default:
      return 'Available'
  }
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}
