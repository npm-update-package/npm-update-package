import {
  intersection,
  partial,
  string,
  type,
  union,
  type TypeOf
} from 'io-ts'
import { PackageMetadataDependencies } from './PackageMetadataDependencies.js'
import { PackageMetadataRepository } from './PackageMetadataRepository.js'

const PackageMetadata = intersection([
  type({
    name: string,
    version: string
  }),
  partial({
    dependencies: PackageMetadataDependencies,
    devDependencies: PackageMetadataDependencies,
    peerDependencies: PackageMetadataDependencies,
    bundledDependencies: PackageMetadataDependencies,
    optionalDependencies: PackageMetadataDependencies,
    repository: union([string, PackageMetadataRepository]),
    homepage: string
  })
])
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type PackageMetadata = TypeOf<typeof PackageMetadata>
export const isPackageMetadata = PackageMetadata.is
