import {
  intersection,
  partial,
  string,
  type,
  type TypeOf
} from 'io-ts'
import { PackageDependencies } from './PackageDependencies'

const Package = intersection([
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
export type Package = TypeOf<typeof Package>
export const isPackage = Package.is
