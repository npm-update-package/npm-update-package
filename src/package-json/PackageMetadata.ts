import {
  intersection,
  partial,
  string,
  type,
  type TypeOf
} from 'io-ts'
import { PackageDependencies } from './PackageDependencies'

const PackageMetadata = intersection([
  type({
    name: string,
    version: string
  }),
  partial({
    dependencies: PackageDependencies,
    devDependencies: PackageDependencies,
    peerDependencies: PackageDependencies,
    optionalDependencies: PackageDependencies
  })
])
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type PackageMetadata = TypeOf<typeof PackageMetadata>
export const isPackageMetadata = PackageMetadata.is
