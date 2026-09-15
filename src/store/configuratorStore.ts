import { create } from 'zustand'
import { getERPAdapter } from '../adapters'
import type {
  CameraPreset,
  ConfigurationPayload,
  FrameFinish,
  HandleOption,
  LightingMode,
  MaterialFinish,
  PriceQuote,
  Product,
  StockStatus,
} from '../adapters/types'
import { COMPONENT_IDS, DEFAULTS, FRAME_FINISHES, HANDLES, MATERIALS, PRODUCT } from '../data/seed'
import { createConfigurationId } from '../lib/configId'
import { clamp } from '../lib/format'
import { quotePrice } from '../services/pricing'

export type CatalogState = {
  product: Product
  materials: MaterialFinish[]
  frames: FrameFinish[]
  handles: HandleOption[]
}

export type ConfiguratorState = CatalogState & {
  materialId: string
  frameId: string
  handleId: string
  widthMm: number
  heightMm: number
  lighting: LightingMode
  doorOpen: boolean
  cameraPreset: CameraPreset
  cameraNonce: number
  configurationId: string
  compareEnabled: boolean
  compareA: string
  compareB: string
  compareShowing: 'a' | 'b'
  loaded: boolean
  setMaterial: (id: string) => void
  setFrame: (id: string) => void
  setHandle: (id: string) => void
  setWidth: (mm: number) => void
  setHeight: (mm: number) => void
  setLighting: (mode: LightingMode) => void
  toggleDoor: () => void
  setDoorOpen: (open: boolean) => void
  setCameraPreset: (preset: CameraPreset) => void
  setCompareEnabled: (enabled: boolean) => void
  setCompareShowing: (side: 'a' | 'b') => void
  hydrateCatalog: (catalog: Partial<CatalogState>) => void
  reset: () => void
  hasChanges: () => boolean
}

function findMaterial(materials: MaterialFinish[], id: string): MaterialFinish {
  return materials.find((item) => item.id === id) ?? materials[0] ?? MATERIALS[0]
}
function findFrame(frames: FrameFinish[], id: string): FrameFinish {
  return frames.find((item) => item.id === id) ?? frames[0] ?? FRAME_FINISHES[0]
}
function findHandle(handles: HandleOption[], id: string): HandleOption {
  return handles.find((item) => item.id === id) ?? handles[0] ?? HANDLES[0]
}

export const useConfiguratorStore = create<ConfiguratorState>((set, get) => ({
  product: PRODUCT,
  materials: MATERIALS,
  frames: FRAME_FINISHES,
  handles: HANDLES,
  materialId: DEFAULTS.materialId,
  frameId: DEFAULTS.frameId,
  handleId: DEFAULTS.handleId,
  widthMm: DEFAULTS.widthMm,
  heightMm: DEFAULTS.heightMm,
  lighting: DEFAULTS.lighting,
  doorOpen: false,
  cameraPreset: 'front',
  cameraNonce: 0,
  configurationId: createConfigurationId(),
  compareEnabled: false,
  compareA: 'MAT-001',
  compareB: 'MAT-003',
  compareShowing: 'a',
  loaded: true,
  setMaterial: (id) => set({ materialId: id }),
  setFrame: (id) => set({ frameId: id }),
  setHandle: (id) => set({ handleId: id }),
  setWidth: (mm) => set({ widthMm: clamp(Math.round(mm), DEFAULTS.minWidthMm, DEFAULTS.maxWidthMm) }),
  setHeight: (mm) => set({ heightMm: clamp(Math.round(mm), DEFAULTS.minHeightMm, DEFAULTS.maxHeightMm) }),
  setLighting: (mode) => set({ lighting: mode }),
  toggleDoor: () => set({ doorOpen: !get().doorOpen }),
  setDoorOpen: (open) => set({ doorOpen: open }),
  setCameraPreset: (preset) => set((state) => ({ cameraPreset: preset, cameraNonce: state.cameraNonce + 1 })),
  setCompareEnabled: (enabled) => set({ compareEnabled: enabled, compareShowing: 'a' }),
  setCompareShowing: (side) => set({ compareShowing: side }),
  hydrateCatalog: (catalog) =>
    set({
      product: catalog.product ?? PRODUCT,
      materials: catalog.materials ?? MATERIALS,
      frames: catalog.frames ?? FRAME_FINISHES,
      handles: catalog.handles ?? HANDLES,
    }),
  reset: () =>
    set({
      materialId: DEFAULTS.materialId,
      frameId: DEFAULTS.frameId,
      handleId: DEFAULTS.handleId,
      widthMm: DEFAULTS.widthMm,
      heightMm: DEFAULTS.heightMm,
      lighting: DEFAULTS.lighting,
      doorOpen: false,
      cameraPreset: 'front',
      cameraNonce: get().cameraNonce + 1,
      configurationId: createConfigurationId(),
      compareEnabled: false,
      compareShowing: 'a',
    }),
  hasChanges: () => {
    const s = get()
    return (
      s.materialId !== DEFAULTS.materialId ||
      s.frameId !== DEFAULTS.frameId ||
      s.handleId !== DEFAULTS.handleId ||
      s.widthMm !== DEFAULTS.widthMm ||
      s.heightMm !== DEFAULTS.heightMm ||
      s.lighting !== DEFAULTS.lighting ||
      s.doorOpen ||
      s.compareEnabled
    )
  },
}))

export function selectActiveMaterialId(state: ConfiguratorState): string {
  if (state.compareEnabled) {
    return state.compareShowing === 'a' ? state.compareA : state.compareB
  }
  return state.materialId
}

export function getSelectedEntities(state: ConfiguratorState) {
  const material = findMaterial(state.materials, selectActiveMaterialId(state))
  const configuredMaterial = findMaterial(state.materials, state.materialId)
  const frame = findFrame(state.frames, state.frameId)
  const handle = findHandle(state.handles, state.handleId)
  return { material, configuredMaterial, frame, handle, product: state.product }
}

export function getQuoteFromState(state: ConfiguratorState): PriceQuote {
  const { configuredMaterial, frame, handle, product } = getSelectedEntities(state)
  return quotePrice({
    product,
    material: configuredMaterial,
    frame,
    handle,
    widthMm: state.widthMm,
    heightMm: state.heightMm,
  })
}

export function getAvailability(state: ConfiguratorState): StockStatus {
  const { configuredMaterial, frame, handle } = getSelectedEntities(state)
  const statuses = [configuredMaterial.stockStatus, frame.stockStatus, handle.stockStatus]
  if (statuses.includes('out_of_stock')) return 'out_of_stock'
  if (statuses.includes('made_to_order')) return 'made_to_order'
  if (statuses.includes('low_stock')) return 'low_stock'
  return 'in_stock'
}

export function buildConfigurationPayload(state: ConfiguratorState): ConfigurationPayload {
  const { configuredMaterial, frame, handle, product } = getSelectedEntities(state)
  const quote = getQuoteFromState(state)
  const adapter = getERPAdapter()
  return adapter.buildPayload({
    configurationId: state.configurationId,
    productId: product.id,
    baseSku: product.baseSku,
    quantity: 1,
    widthMm: state.widthMm,
    heightMm: state.heightMm,
    material: { id: configuredMaterial.id, sku: configuredMaterial.sku, name: configuredMaterial.name },
    frame: { id: frame.id, sku: frame.sku, name: frame.name },
    handle: { id: handle.id, sku: handle.sku, name: handle.name },
    components: [
      { componentId: COMPONENT_IDS.doorLeaf, sku: product.baseSku, name: product.name },
      { componentId: COMPONENT_IDS.doorFrame, sku: frame.sku, name: frame.name },
      { componentId: COMPONENT_IDS.doorHandle, sku: handle.sku, name: handle.name },
      { componentId: COMPONENT_IDS.doorLock, sku: 'LCK-CYL-001', name: 'Cylinder Lockset' },
      { componentId: COMPONENT_IDS.doorGlass, sku: 'GLS-LITE-001', name: 'Vertical Glazed Lite' },
      { componentId: COMPONENT_IDS.doorThreshold, sku: 'THR-ALM-001', name: 'Aluminum Threshold' },
    ],
    price: quote.total,
    currency: quote.currency,
    lighting: state.lighting,
    provider: adapter.providerLabel,
  })
}
