import type { OptionType } from './OptionType'

interface OptionBase {
  name: string
  description: string
  type: OptionType
  choices?: string[]
}

interface RequiredOption extends OptionBase {
  required: true
}

interface OptionalOption extends OptionBase {
  required: false
  default?: number | string | string[]
}

export type CLIOption = RequiredOption | OptionalOption
