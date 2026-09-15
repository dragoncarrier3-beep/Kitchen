export type StockStatus = 'in_stock' | 'low_stock' | 'made_to_order' | 'out_of_stock'

export type LightingMode = 'day' | 'night'

export type CameraPreset = 'front' | 'angle' | 'handle' | 'full'

export type HandleStyle = 'lever_black' | 'lever_stainless' | 'pull_bar'

export interface Money {
  amount: number
  currency: 'USD'
}

export interface Product {
  id: string
  name: string
  baseSku: string
  category: string
  basePrice: number
  currency: 'USD'
  status: 'active' | 'inactive'
  description: string
}

export interface MaterialFinish {
  id: string
  name: string
  sku: string
  thumbnail: string
  baseColor: string
  roughness: number
  metalness: number
  priceAdjustment: number
  stockStatus: StockStatus
  textureKind: 'oak' | 'walnut' | 'paint' | 'metal'
}

export interface FrameFinish {
  id: string
  name: string
  sku: string
  thumbnail: string
  baseColor: string
  roughness: number
  metalness: number
  priceAdjustment: number
  stockStatus: StockStatus
  textureKind: 'oak' | 'walnut' | 'paint' | 'metal'
}

export interface HandleOption {
  id: string
  name: string
  sku: string
  style: HandleStyle
  priceAdjustment: number
  stockStatus: StockStatus
  finishColor: string
  metalness: number
  roughness: number
}

export interface AccessoryCatalog {
  handles: HandleOption[]
}

export interface StockSnapshot {
  sku: string
  status: StockStatus
  quantityAvailable: number | null
}

export interface PriceQuote {
  basePrice: number
  materialAdjustment: number
  frameAdjustment: number
  handleAdjustment: number
  dimensionSurcharge: number
  total: number
  currency: 'USD'
}

export interface ConfigurationPayload {
  configurationId: string
  productId: string
  baseSku: string
  quantity: number
  widthMm: number
  heightMm: number
  material: { id: string; sku: string; name: string }
  frame: { id: string; sku: string; name: string }
  handle: { id: string; sku: string; name: string }
  components: Array<{ componentId: string; sku: string; name: string }>
  price: number
  currency: 'USD'
  lighting: LightingMode
  provider: string
}

export interface OrderDraft {
  payload: ConfigurationPayload
  notes?: string
}

export interface OrderResult {
  accepted: boolean
  message: string
}
