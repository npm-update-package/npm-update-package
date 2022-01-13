import {
  intersection,
  partial,
  record,
  string,
  type,
  type TypeOf
} from 'io-ts'

const Package = intersection([
  type({
    name: string,
    version: string
  }),
  partial({
    dependencies: record(string, string),
    devDependencies: record(string, string),
    peerDependencies: record(string, string),
    optionalDependencies: record(string, string)
  })
])
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Package = TypeOf<typeof Package>
export const isPackage = Package.is
