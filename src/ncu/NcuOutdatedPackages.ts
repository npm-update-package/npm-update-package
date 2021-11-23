import type {
  Index,
  VersionSpec
} from 'npm-check-updates/build/src/types'

export type NcuOutdatedPackages = Index<VersionSpec>
