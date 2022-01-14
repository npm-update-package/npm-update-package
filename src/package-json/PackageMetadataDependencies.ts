import {
  record,
  string,
  type TypeOf
} from 'io-ts'

export const PackageMetadataDependencies = record(string, string)
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type PackageMetadataDependencies = TypeOf<typeof PackageMetadataDependencies>
export const isPackageMetadataDependencies = PackageMetadataDependencies.is
