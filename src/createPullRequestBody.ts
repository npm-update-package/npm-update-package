import pkg from '../package.json'
import type { OutdatedPackage } from './types/OutdatedPackage'

// TODO: add link to package names
export const createPullRequestBody = (outdatedPackage: OutdatedPackage): string => {
  const packageName = outdatedPackage.name
  const currentVersion = outdatedPackage.currentVersion.version
  const newVersion = outdatedPackage.newVersion.version
  return `This PR updates these packages:

|package|current version|new version|
|---|---|---|
|${packageName}|\`${currentVersion}\`|\`${newVersion}\`|

---
This PR has been generated by ${pkg.name}`
}
