import { getOutdatedPackages } from './getOutdatedPackages'

export const main = async (): Promise<void> => {
  // get outdated packages
  const outdatedPackages = await getOutdatedPackages()
  console.debug({ outdatedPackages })

  for (const outdatedPackage of outdatedPackages) {
    console.debug({ outdatedPackage })

    // TODO: create branch

    // TODO: update packages

    // TODO: commit & push

    // TODO: create PR

    // TODO: remove branch
  }
}
