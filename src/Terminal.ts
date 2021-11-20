import execa from 'execa'
import type { ExecaReturnValue } from 'execa'
import { isExecaReturnValue } from './isExecaReturnValue'
import { logger } from './logger'

// TODO: add test
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
      logger.debug(`e=${JSON.stringify(e)}`)
      const value: unknown = e instanceof Error ? JSON.parse(JSON.stringify(e)) : e
      logger.debug(`value=${JSON.stringify(value)}`)

      if (isExecaReturnValue(value)) {
        return value
      } else {
        throw e
      }
    }
  }
}
