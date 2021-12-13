import execa from 'execa'
import type { ExecaReturnValue } from 'execa'

// TODO: add test
export class Terminal {
  async run (
    command: string,
    ...args: string[]
  ): Promise<ExecaReturnValue<string>> {
    return await execa(command, args)
  }
}
