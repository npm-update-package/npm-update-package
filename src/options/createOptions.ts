import { program } from 'commander'
import pkg from '../../package.json' with { type: 'json '}
import type { CLIOption } from './CLIOption.js'
import type { Options } from './Options.js'
import { isOptions } from './Options.js'
import { toCommanderOption } from './toCommanderOption.js'

export const createOptions = (cliOptions: CLIOption[]): Options => {
  program.version(pkg.version)
  cliOptions
    .map(option => toCommanderOption(option))
    .forEach(option => program.addOption(option))
  program.parse(process.argv)
  const options = program.opts()

  if (!isOptions(options)) {
    throw new Error(`Failed to parse command-line options. options=${JSON.stringify(options)}`)
  }

  return options
}
