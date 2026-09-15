import { DEFAULTS } from '../data/seed'
import type { FrameFinish, HandleOption, MaterialFinish, PriceQuote, Product } from '../adapters/types'

export function dimensionSurcharge(widthMm: number, heightMm: number): number {
  const extraWidth = Math.max(0, widthMm - DEFAULTS.standardWidthMm)
  const extraHeight = Math.max(0, heightMm - DEFAULTS.standardHeightMm)
  const raw = extraWidth * 0.8 + extraHeight * 1.0
  return Math.round(raw)
}

export function quotePrice(input: {
  product: Product
  material: MaterialFinish
  frame: FrameFinish
  handle: HandleOption
  widthMm: number
  heightMm: number
}): PriceQuote {
  const materialAdjustment = input.material.priceAdjustment
  const frameAdjustment = input.frame.priceAdjustment
  const handleAdjustment = input.handle.priceAdjustment
  const surcharge = dimensionSurcharge(input.widthMm, input.heightMm)
  const total =
    input.product.basePrice +
    materialAdjustment +
    frameAdjustment +
    handleAdjustment +
    surcharge

  return {
    basePrice: input.product.basePrice,
    materialAdjustment,
    frameAdjustment,
    handleAdjustment,
    dimensionSurcharge: surcharge,
    total,
    currency: 'USD',
  }
}
