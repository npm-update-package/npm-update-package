interface OptionBase {
  name: string
  description: string
  choices?: string[]
}

interface RequiredOption extends OptionBase {
  required: true
}

interface OptionalOption extends OptionBase {
  required: false
  default: string
}

export type CLIOption = RequiredOption | OptionalOption
