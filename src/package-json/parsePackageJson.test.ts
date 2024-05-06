import {
  describe,
  expect,
  it
} from '@jest/globals'
import type { PackageMetadata } from './PackageMetadata.js'
import { parsePackageJson } from './parsePackageJson.js'

describe('parsePackageJson', () => {
  const metadata: PackageMetadata = {
    name: '@npm-update-package/example',
    version: '1.0.0'
  }

  it('returns parsed object if json is valid', () => {
    const json = JSON.stringify(metadata)

    const actual = parsePackageJson(json)

    expect(actual).toEqual(metadata)
  })

  it('throws error if json is invalid', () => {
    const json = JSON.stringify({
      ...metadata,
      version: undefined
    })

    expect(() => parsePackageJson(json)).toThrow(Error)
  })
})
