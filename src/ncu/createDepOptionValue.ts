import type { DependencyType } from '../package-json'
import { toDependency } from './toDependency'

// TODO: Add test
export const createDepOptionValue = (dependencyTypes: DependencyType[]): string => {
  return dependencyTypes
    .map((dependencyType) => toDependency(dependencyType))
    .join(',')
}
