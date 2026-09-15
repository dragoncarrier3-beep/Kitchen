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
import { FRAME_FINISHES, HANDLES, MATERIALS, PRODUCT } from '../data/seed'
import { quotePrice } from '../services/pricing'

const STOCK_QTY: Record<string, number | null> = {
  'FIN-OAK-001': 42,
  'FIN-WAL-002': 28,
  'FIN-BLK-003': 61,
  'FIN-ANT-004': 4,
  'FIN-WHT-005': 37,
  'FIN-MTL-006': null,
}

export class DemoERPAdapter implements ERPAdapter {
  readonly providerId = 'demo'
  readonly providerLabel = 'Demo ERP Provider'
  readonly isLive = false
  private readonly materials: MaterialFinish[]
  private readonly frames: FrameFinish[]

  constructor(
    materials: MaterialFinish[] = MATERIALS,
    frames: FrameFinish[] = FRAME_FINISHES,
  ) {
    this.materials = materials
    this.frames = frames
  }

  async getProducts(): Promise<Product[]> {
    return [PRODUCT]
  }

  async getProduct(id: string): Promise<Product | null> {
    return id === PRODUCT.id ? PRODUCT : null
  }

  async getMaterials(): Promise<MaterialFinish[]> {
    return this.materials
  }

  async getFrameFinishes(): Promise<FrameFinish[]> {
    return this.frames
  }

  async getAccessories(): Promise<AccessoryCatalog> {
    return { handles: HANDLES }
  }

  async getSKU(entity: 'product' | 'material' | 'frame' | 'handle', id: string): Promise<string | null> {
    if (entity === 'product' && id === PRODUCT.id) return PRODUCT.baseSku
    if (entity === 'material') return this.materials.find((item) => item.id === id)?.sku ?? null
    if (entity === 'frame') return this.frames.find((item) => item.id === id)?.sku ?? null
    if (entity === 'handle') return HANDLES.find((item) => item.id === id)?.sku ?? null
    return null
  }

  async getStock(sku: string): Promise<StockSnapshot> {
    const material = this.materials.find((item) => item.sku === sku)
    const frame = this.frames.find((item) => item.sku === sku)
    const handle = HANDLES.find((item) => item.sku === sku)
    const status = material?.stockStatus ?? frame?.stockStatus ?? handle?.stockStatus ?? 'in_stock'
    return {
      sku,
      status,
      quantityAvailable: STOCK_QTY[sku] ?? (status === 'made_to_order' ? null : 12),
    }
  }

  async getPricing(input: {
    productId: string
    materialId: string
    frameId: string
    handleId: string
    widthMm: number
    heightMm: number
  }): Promise<PriceQuote> {
    const product = (await this.getProduct(input.productId)) ?? PRODUCT
    const material = this.materials.find((item) => item.id === input.materialId) ?? this.materials[0]
    const frame = this.frames.find((item) => item.id === input.frameId) ?? this.frames[0]
    const handle = HANDLES.find((item) => item.id === input.handleId) ?? HANDLES[0]
    return quotePrice({
      product,
      material,
      frame,
      handle,
      widthMm: input.widthMm,
      heightMm: input.heightMm,
    })
  }

  async createOrder(_draft: OrderDraft): Promise<OrderResult> {
    return {
      accepted: false,
      message: 'Orders are disabled in the demo provider. Priority ERP connection will be enabled during the integration phase.',
    }
  }

  buildPayload(config: ConfigurationPayload): ConfigurationPayload {
    return { ...config, provider: this.providerLabel }
  }
}
