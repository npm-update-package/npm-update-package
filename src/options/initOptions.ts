import { program } from 'commander'
import { app } from '../app'
import { cliOptions } from './cliOptions'
import {
  isOptions,
  type Options
} from './Options'
import { toCommanderOption } from './toCommanderOption'

// TODO: add test
export const initOptions = (): Options => {
  program.version(app.version)
  cliOptions
    .map(toCommanderOption)
    .forEach(option => program.addOption(option))
  program.parse(process.argv)
  const options = program.opts()

  if (!isOptions(options)) {
    throw new Error(`Failed to parse command-line options. options=${JSON.stringify(options)}`)
  }

  return options
}
