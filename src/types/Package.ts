import type { PackageDependencies } from './PackageDependencies'

export interface Package {
  name: string
  version: string
  dependencies?: PackageDependencies
  devDependencies?: PackageDependencies
  peerDependencies?: PackageDependencies
  optionalDependencies?: PackageDependencies
}
