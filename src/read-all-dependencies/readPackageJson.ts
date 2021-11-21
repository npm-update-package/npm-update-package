import type { Package } from './Package'

// TODO: create type definition
// eslint-disable-next-line @typescript-eslint/no-var-requires
const readJson = require('read-package-json')

// TODO: add test
export const readPackageJson = async (filePath: string): Promise<Package> => {
  return await new Promise((resolve, reject) => {
    readJson(filePath, (error: Error | null, data: Package) => {
      if (error != null) {
        reject(error)
      } else {
        resolve(data)
      }
    })
  })
}
