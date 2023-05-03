import fs from 'node:fs'
import {
  afterEach,
  describe,
  expect,
  it,
  jest
} from '@jest/globals'
import { readFile } from './readFile'

jest.mock('node:fs', () => ({
  promises: {
    readFile: jest.fn<typeof fs.promises.readFile>()
  }
}))

describe('readFile', () => {
  const readFileMock = jest.mocked(fs.promises.readFile)

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('calls fs.promises.readFile()', async () => {
    const expected = 'file data'
    readFileMock.mockResolvedValue(expected)
    const path = 'package.json'

    const actual = await readFile(path)

    expect(actual).toBe(expected)
    expect(readFileMock).toHaveBeenCalledWith(path, 'utf8')
  })
})
