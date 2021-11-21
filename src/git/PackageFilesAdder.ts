import type { Git } from './Git'

// TODO: add test
export class PackageFilesAdder {
  constructor (private readonly git: Git) {}

  async add (): Promise<void> {
    // TODO: add only necessary files （package.json & package-lock.json or yarn.lock）
    await this.git.addAll()
  }
}
