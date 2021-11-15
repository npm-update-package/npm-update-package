import type { Dependencies } from './types/Dependencies'
import { readPackageJson } from './readPackageJson'

export const readAllDependencies = async (filePath: string): Promise<Dependencies> => {
  const {
    dependencies,
    devDependencies,
    peerDependencies,
    optionalDependencies
  } = await readPackageJson(filePath)
  return {
    ...dependencies,
    ...devDependencies,
    ...peerDependencies,
    ...optionalDependencies
  }
}
