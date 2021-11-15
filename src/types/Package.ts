import type { Dependencies } from './Dependencies'

export interface Package {
  name: string
  version: string
  dependencies?: Dependencies
  devDependencies?: Dependencies
  peerDependencies?: Dependencies
  optionalDependencies?: Dependencies
}
