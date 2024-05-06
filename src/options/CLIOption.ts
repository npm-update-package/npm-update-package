import type { OptionType } from './OptionType.js'

interface OptionBase {
  name: string
  description: string
  choices?: string[]
}

interface RequiredOption extends OptionBase {
  required: true
  type: OptionType
}

interface OptionalBooleanOption extends OptionBase {
  required: false
  type: typeof OptionType.Boolean
  default?: boolean
}

interface OptionalNumberOption extends OptionBase {
  required: false
  type: typeof OptionType.Number
  default?: number
}

interface OptionalStringOption extends OptionBase {
  required: false
  type: typeof OptionType.String
  default?: string
}

interface OptionalStringArrayOption extends OptionBase {
  required: false
  type: typeof OptionType.StringArray
  default?: string[]
}

type OptionalOption = OptionalBooleanOption | OptionalNumberOption | OptionalStringOption | OptionalStringArrayOption

export type CLIOption = RequiredOption | OptionalOption
