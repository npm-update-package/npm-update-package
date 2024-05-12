import execa from 'execa'

// TODO: Add test
export class Terminal {
  async run (
    command: string,
    ...args: string[]
  ): Promise<string> {
    const { stdout } = await execa(command, args)
    return stdout
  }
}
