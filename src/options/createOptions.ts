import { program } from 'commander'
import * as app from '../app.js'
import type { CLIOption } from './CLIOption.js'
import type { Options } from './Options.js'
import { isOptions } from './Options.js'
import { toCommanderOption } from './toCommanderOption.js'

export const createOptions = (cliOptions: CLIOption[]): Options => {
  program.version(app.version)
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
