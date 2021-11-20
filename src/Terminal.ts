import execa from 'execa'
import type { ExecaReturnValue } from 'execa'
import { isExecaReturnValue } from './isExecaReturnValue'

// TODO: add test
// TODO: add logs using logger
export class Terminal {
  async run (
    command: string,
    ...args: string[]
  ): Promise<ExecaReturnValue<string>> {
    return await execa(command, args)
  }

  async runWithErrorHandling (
    command: string,
    ...args: string[]
  ): Promise<ExecaReturnValue<string>> {
    try {
      return await this.run(command, ...args)
    } catch (e) {
      const value: unknown = e instanceof Error ? JSON.parse(JSON.stringify(e)) : e

      if (isExecaReturnValue(value)) {
        return value
      } else {
        throw e
      }
    }
  }
}
