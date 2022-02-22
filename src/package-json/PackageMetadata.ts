import {
  intersection,
  partial,
  string,
  type,
  union,
  type TypeOf
} from 'io-ts'
import { PackageMetadataDependencies } from './PackageMetadataDependencies'
import { PackageMetadataRepository } from './PackageMetadataRepository'

const PackageMetadata = intersection([
  type({
    name: string,
    version: string
  }),
  partial({
    dependencies: PackageMetadataDependencies,
    devDependencies: PackageMetadataDependencies,
    peerDependencies: PackageMetadataDependencies,
    optionalDependencies: PackageMetadataDependencies,
    repository: union([string, PackageMetadataRepository])
  })
])
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type PackageMetadata = TypeOf<typeof PackageMetadata>
export const isPackageMetadata = PackageMetadata.is
