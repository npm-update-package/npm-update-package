import assert from 'node:assert'
import {
  describe,
  it
} from 'node:test'
import type { PackageMetadata } from './PackageMetadata.js'
import { parsePackageJson } from './parsePackageJson.js'

await describe('parsePackageJson', async () => {
  const metadata: PackageMetadata = {
    name: '@npm-update-package/example',
    version: '1.0.0'
  }

  await it('returns parsed object if json is valid', () => {
    const json = JSON.stringify(metadata)

    const actual = parsePackageJson(json)

    assert.deepStrictEqual(actual, metadata)
  })

  await it('throws error if json is invalid', () => {
    const json = JSON.stringify({
      ...metadata,
      version: undefined
    })

    assert.throws(() => parsePackageJson(json), Error)
  })
})
