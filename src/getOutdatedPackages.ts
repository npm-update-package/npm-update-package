import type { OutdatedPackage } from './types'
import { runNcu } from './runNcu'

// TODO: add test
export const getOutdatedPackages = async (): Promise<OutdatedPackage[]> => {
  return await runNcu({
    jsonUpgraded: true
  })
}
