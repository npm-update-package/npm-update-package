import {
  afterEach,
  describe,
  expect,
  it,
  jest
} from '@jest/globals'
import shuffle from 'array-shuffle'
import { sampleSize } from './sampleSize'

jest.mock('array-shuffle')

describe('sampleSize', () => {
  const shuffleMock = jest.mocked(shuffle)

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('returns sampled values', () => {
    shuffleMock.mockReturnValue(['a', 'b', 'c'])

    const actual = sampleSize(['b', 'c', 'a'], 2)

    expect(actual).toEqual(['a', 'b'])
  })
})
