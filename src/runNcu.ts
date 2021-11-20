import { run } from 'npm-check-updates'
import type { Options } from 'npm-check-updates/build/src/types'
import type { OutdatedPackage } from './types/OutdatedPackage'
import { isNcuOutdatedPackages } from './isNcuOutdatedPackages'
import { logger } from './logger'
import { toOutdatedPackages } from './toOutdatedPackages'

// TODO: add test
export const runNcu = async (options: Options): Promise<OutdatedPackage[]> => {
  const result = await run(options)
  logger.debug(`result=${JSON.stringify(result)}`)

  if (!isNcuOutdatedPackages(result)) {
    throw new Error('result is not NcuOutdatedPackages')
  }

  return await toOutdatedPackages(result)
}
