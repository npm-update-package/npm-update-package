export const OptionType = {
  Boolean: 'boolean',
  Number: 'number',
  String: 'string',
  StringArray: 'string[]'
} as const
// eslint-disable-next-line @typescript-eslint/no-redeclare
export type OptionType = typeof OptionType[keyof typeof OptionType]
const optionTypes = Object.values(OptionType)
export const isOptionType = (value: any): value is OptionType => optionTypes.includes(value)
