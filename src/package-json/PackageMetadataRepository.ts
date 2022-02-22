import {
  string,
  type,
  type TypeOf
} from 'io-ts'

export const PackageMetadataRepository = type({
  url: string
})
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type PackageMetadataRepository = TypeOf<typeof PackageMetadataRepository>
export const isPackageMetadataRepository = PackageMetadataRepository.is
