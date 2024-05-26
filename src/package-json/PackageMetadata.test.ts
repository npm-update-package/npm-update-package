import assert from 'node:assert'
import {
  describe,
  it
} from 'node:test'
import { isPackageMetadata } from './PackageMetadata.js'
import type { PackageMetadata } from './PackageMetadata.js'

await describe('isPackageMetadata', async () => {
  await describe('returns whether value is PackageMetadata', async () => {
    const { each } = await import('test-each')
    const metadata: PackageMetadata = {
      name: '@npm-update-package/example',
      version: '1.0.0',
      dependencies: {
        '@npm-update-package/example-dependencies': '1.0.0'
      },
      devDependencies: {
        '@npm-update-package/example-devDependencies': '1.0.0'
      },
      peerDependencies: {
        '@npm-update-package/example-peerDependencies': '1.0.0'
      },
      bundledDependencies: {
        '@npm-update-package/example-bundledDependencies': '1.0.0'
      },
      optionalDependencies: {
        '@npm-update-package/example-optionalDependencies': '1.0.0'
      },
      repository: 'npm-update-package/example'
    }
    const inputs: Array<[value: unknown, expected: boolean]> = [
      [metadata, true],
      [{ ...metadata, name: undefined }, false]
    ]
    each(inputs, ({ title }, [value, expected]) => {
      void it(title, () => {
        const actual = isPackageMetadata(value)

        assert.strictEqual(actual, expected)
      })
    })
  })
})
