import { DependencyType } from '../package-json'
import { Dependency } from './Dependency'

// TODO: Add test
export const toDependency = (dependencyType: DependencyType): Dependency => {
  switch (dependencyType) {
    case DependencyType.Dependencies:
      return Dependency.Prod
    case DependencyType.DevDependencies:
      return Dependency.Dev
    case DependencyType.PeerDependencies:
      return Dependency.Peer
    case DependencyType.BundledDependencies:
      return Dependency.Bundle
    case DependencyType.OptionalDependencies:
      return Dependency.Optional
  }
}
