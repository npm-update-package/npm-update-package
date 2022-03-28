import { InvalidArgumentError } from 'commander'

export const parseNumberOption = (value: string): number => {
  const number = Number(value)

  if (Number.isNaN(number)) {
    throw new InvalidArgumentError('Not a number.')
  }

  return number
}
