import { DemoERPAdapter } from './DemoERPAdapter'
import type { ERPAdapter } from './ERPAdapter'

let current: ERPAdapter = new DemoERPAdapter()

export function getERPAdapter(): ERPAdapter {
  return current
}

export function setERPAdapter(adapter: ERPAdapter): void {
  current = adapter
}

export { DemoERPAdapter } from './DemoERPAdapter'
export { PriorityERPAdapter } from './PriorityERPAdapter'
export { SAPBusinessOneAdapter } from './SAPBusinessOneAdapter'
export type { ERPAdapter } from './ERPAdapter'
