import type { OutdatedPackage } from '../../../core'

export const createOutdatedPackagesTable = (outdatedPackage: OutdatedPackage): string => {
  const packageName = outdatedPackage.name
  const packageLink = `[${packageName}](https://www.npmjs.com/package/${packageName})`
  const dependencyType = outdatedPackage.dependencyType
  const level = outdatedPackage.level
  const currentVersion = outdatedPackage.currentVersion.version
  const currentVersionLink = `[\`${currentVersion}\`](https://www.npmjs.com/package/${packageName}/v/${currentVersion})`
  const newVersion = outdatedPackage.newVersion.version
  const newVersionLink = `[\`${newVersion}\`](https://www.npmjs.com/package/${packageName}/v/${newVersion})`
  return `|Package|Dependency type|Level|Current version|New version|
|---|---|---|---|---|
|${packageLink}|${dependencyType}|${level}|${currentVersionLink}|${newVersionLink}|`
}
