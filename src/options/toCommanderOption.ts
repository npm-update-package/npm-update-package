import { Option } from 'commander'
import type { CLIOption } from './CLIOption'
import { OptionType } from './OptionType'
import { parseBooleanOption } from './parseBooleanOption'
import { parseNumberOption } from './parseNumberOption'

export const toCommanderOption = (cliOption: CLIOption): Option => {
  const argument = createArgumentString(cliOption)
  const option = new Option(`--${cliOption.name} ${argument}`, cliOption.description)

  if (cliOption.choices !== undefined) {
    option.choices(cliOption.choices)
  }

  if (!cliOption.required && cliOption.default !== undefined) {
    option.default(cliOption.default)
  }

  if (cliOption.type === OptionType.Boolean) {
    option.argParser(parseBooleanOption)
  }

  if (cliOption.type === OptionType.Number) {
    option.argParser(parseNumberOption)
  }

  return option
}

const createArgumentString = (cliOption: CLIOption): string => {
  const name = createArgumentNameString(cliOption.type)
  return cliOption.required ? `<${name}>` : `[${name}]`
}

const createArgumentNameString = (optionType: OptionType): string => {
  switch (optionType) {
    case OptionType.Boolean:
      return 'boolean'
    case OptionType.Number:
      return 'number'
    case OptionType.String:
      return 'string'
    case OptionType.StringArray:
      return 'strings...'
  }
}
