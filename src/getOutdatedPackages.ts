import { run } from 'npm-check-updates'
import type { OutdatedPackage } from './types/OutdatedPackage'
import { isNcuOutdatedPackages } from './isNcuOutdatedPackages'
import { logger } from './logger'
import { toOutdatedPackages } from './toOutdatedPackages'

// TODO: add test
export const getOutdatedPackages = async (): Promise<OutdatedPackage[]> => {
  const result = await run({
    jsonUpgraded: true
  })
  logger.debug(`result=${JSON.stringify(result)}`)

  if (!isNcuOutdatedPackages(result)) {
    throw new Error('result is not NcuOutdatedPackages')
  }

  return await toOutdatedPackages(result)
}
