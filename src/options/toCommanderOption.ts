import { Option } from 'commander'
import type { CLIOption } from './CLIOption'

// TODO: add test
export const toCommanderOption = (cliOption: CLIOption): Option => {
  const value = cliOption.required ? '<value>' : '[value]'
  const option = new Option(`--${cliOption.name} ${value}`, cliOption.description)

  if (cliOption.choices !== undefined) {
    option.choices(cliOption.choices)
  }

  if (!cliOption.required && cliOption.default !== undefined) {
    option.default(cliOption.default)
  }

  return option
}
