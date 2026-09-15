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
 * Production stub. Replace method bodies with Priority REST calls in Phase 3.
 * The configurator should keep importing ERPAdapter, not this class directly.
 */
export class PriorityERPAdapter implements ERPAdapter {
  readonly providerId = 'priority'
  readonly providerLabel = 'Priority ERP'
  readonly isLive = false

  async getProducts(): Promise<Product[]> {
    throw new Error('PriorityERPAdapter is not enabled in Phase 1.')
  }
  async getProduct(_id: string): Promise<Product | null> {
    throw new Error('PriorityERPAdapter is not enabled in Phase 1.')
  }
  async getMaterials(): Promise<MaterialFinish[]> {
    throw new Error('PriorityERPAdapter is not enabled in Phase 1.')
  }
  async getFrameFinishes(): Promise<FrameFinish[]> {
    throw new Error('PriorityERPAdapter is not enabled in Phase 1.')
  }
  async getAccessories(): Promise<AccessoryCatalog> {
    throw new Error('PriorityERPAdapter is not enabled in Phase 1.')
  }
  async getSKU(): Promise<string | null> {
    throw new Error('PriorityERPAdapter is not enabled in Phase 1.')
  }
  async getStock(_sku: string): Promise<StockSnapshot> {
    throw new Error('PriorityERPAdapter is not enabled in Phase 1.')
  }
  async getPricing(): Promise<PriceQuote> {
    throw new Error('PriorityERPAdapter is not enabled in Phase 1.')
  }
  async createOrder(_draft: OrderDraft): Promise<OrderResult> {
    throw new Error('PriorityERPAdapter is not enabled in Phase 1.')
  }
  buildPayload(config: ConfigurationPayload): ConfigurationPayload {
    return { ...config, provider: this.providerLabel }
  }
}
