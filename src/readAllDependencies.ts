import type { PackageDependencies } from './types'
import { logger } from './logger'
import { readPackageJson } from './readPackageJson'

// TODO: add test
export const readAllDependencies = async (filePath: string): Promise<PackageDependencies> => {
  const {
    dependencies,
    devDependencies,
    peerDependencies,
    optionalDependencies
  } = await readPackageJson(filePath)
  logger.debug(`dependencies=${JSON.stringify(dependencies)}`)
  logger.debug(`devDependencies=${JSON.stringify(devDependencies)}`)
  logger.debug(`peerDependencies=${JSON.stringify(peerDependencies)}`)
  logger.debug(`optionalDependencies=${JSON.stringify(optionalDependencies)}`)
  return {
    ...dependencies,
    ...devDependencies,
    ...peerDependencies,
    ...optionalDependencies
  }
}
