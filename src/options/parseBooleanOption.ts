import { InvalidArgumentError } from 'commander'

export const parseBooleanOption = (value: string): boolean => {
  switch (value) {
    case 'true':
      return true
    case 'false':
      return false
    default:
      throw new InvalidArgumentError('Not a boolean.')
  }
}
