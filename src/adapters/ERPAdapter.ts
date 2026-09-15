import type {
  AccessoryCatalog,
  ConfigurationPayload,
  FrameFinish,
  MaterialFinish,
  OrderDraft,
  OrderResult,
  PriceQuote,
  Product,
  StockSnapshot,
} from './types'

/**
 * Stable integration surface for catalog, pricing, stock and order creation.
 * Visual configurator code should depend on this interface only.
 * Production connectors (Priority ERP, SAP Business One) replace the demo adapter
 * without rewriting the scene or UI.
 */
export interface ERPAdapter {
  readonly providerId: string
  readonly providerLabel: string
  readonly isLive: boolean

  getProducts(): Promise<Product[]>
  getProduct(id: string): Promise<Product | null>
  getMaterials(): Promise<MaterialFinish[]>
  getFrameFinishes(): Promise<FrameFinish[]>
  getAccessories(): Promise<AccessoryCatalog>
  getSKU(entity: 'product' | 'material' | 'frame' | 'handle', id: string): Promise<string | null>
  getStock(sku: string): Promise<StockSnapshot>
  getPricing(input: {
    productId: string
    materialId: string
    frameId: string
    handleId: string
    widthMm: number
    heightMm: number
  }): Promise<PriceQuote>
  createOrder(draft: OrderDraft): Promise<OrderResult>
  buildPayload(config: ConfigurationPayload): ConfigurationPayload
}
