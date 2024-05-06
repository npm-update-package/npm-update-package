import type { DependencyType } from '../package-json/DependencyType.js'
import { toDependency } from './toDependency.js'

// TODO: Add test
export const createDepOptionValue = (dependencyTypes: DependencyType[]): string => {
  return dependencyTypes
    .map((dependencyType) => toDependency(dependencyType))
    .join(',')
}
