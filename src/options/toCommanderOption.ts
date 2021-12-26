import { Option } from 'commander'
import type { CLIOption } from './CLIOption'
import { OptionType } from './OptionType'

// TODO: add test
export const toCommanderOption = (cliOption: CLIOption): Option => {
  const argument = createArgumentString(cliOption)
  const option = new Option(`--${cliOption.name} ${argument}`, cliOption.description)

  if (cliOption.choices !== undefined) {
    option.choices(cliOption.choices)
  }

  if (!cliOption.required && cliOption.default !== undefined) {
    option.default(cliOption.default)
  }

  return option
}

const createArgumentString = (cliOption: CLIOption): string => {
  const prefix = cliOption.required ? '<' : '['
  const suffix = cliOption.required ? '>' : ']'
  const name = createArgumentNameString(cliOption.type)
  return `${prefix}${name}${suffix}`
}

const createArgumentNameString = (optionType: OptionType): string => {
  switch (optionType) {
    case OptionType.String:
      return 'value'
    case OptionType.StringArray:
      return 'values...'
  }
}
