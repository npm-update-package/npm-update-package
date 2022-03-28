import { InvalidArgumentError } from 'commander'

export const toBoolean = (value: string): boolean => {
  switch (value) {
    case 'true':
      return true
    case 'false':
      return false
    default:
      throw new InvalidArgumentError('Not a boolean.')
  }
}
