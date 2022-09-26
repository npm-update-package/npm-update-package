import shuffle from 'array-shuffle'

export const sampleSize = <T>(array: T[], size: number): T[] => {
  return shuffle(array).slice(0, size)
}
