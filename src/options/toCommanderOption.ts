import { Option } from 'commander'
import type { CLIOption } from './CLIOption'

// TODO: add test
export const toCommanderOption = (cliOption: CLIOption): Option => {
  const option = new Option(`--${cliOption.name} <value>`, cliOption.description)
  option.makeOptionMandatory(cliOption.required)

  if (cliOption.choices !== undefined) {
    option.choices(cliOption.choices)
  }

  if (!cliOption.required) {
    option.default(cliOption.default)
  }

  return option
}
