import type { ERPAdapter } from './ERPAdapter'
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
 * Production stub. Replace method bodies with SAP Business One Service Layer
 * or catalog FTP sync in Phase 3. Not used by the Phase 1 door POC.
 */
export class SAPBusinessOneAdapter implements ERPAdapter {
  readonly providerId = 'sap-b1'
  readonly providerLabel = 'SAP Business One'
  readonly isLive = false

  async getProducts(): Promise<Product[]> {
    throw new Error('SAPBusinessOneAdapter is not enabled in Phase 1.')
  }
  async getProduct(_id: string): Promise<Product | null> {
    throw new Error('SAPBusinessOneAdapter is not enabled in Phase 1.')
  }
  async getMaterials(): Promise<MaterialFinish[]> {
    throw new Error('SAPBusinessOneAdapter is not enabled in Phase 1.')
  }
  async getFrameFinishes(): Promise<FrameFinish[]> {
    throw new Error('SAPBusinessOneAdapter is not enabled in Phase 1.')
  }
  async getAccessories(): Promise<AccessoryCatalog> {
    throw new Error('SAPBusinessOneAdapter is not enabled in Phase 1.')
  }
  async getSKU(): Promise<string | null> {
    throw new Error('SAPBusinessOneAdapter is not enabled in Phase 1.')
  }
  async getStock(_sku: string): Promise<StockSnapshot> {
    throw new Error('SAPBusinessOneAdapter is not enabled in Phase 1.')
  }
  async getPricing(): Promise<PriceQuote> {
    throw new Error('SAPBusinessOneAdapter is not enabled in Phase 1.')
  }
  async createOrder(_draft: OrderDraft): Promise<OrderResult> {
    throw new Error('SAPBusinessOneAdapter is not enabled in Phase 1.')
  }
  buildPayload(config: ConfigurationPayload): ConfigurationPayload {
    return { ...config, provider: this.providerLabel }
  }
}
