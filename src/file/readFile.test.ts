import fs from 'fs'
import { readFile } from './readFile'

jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn()
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
    expect(readFileMock).toBeCalledWith(path, 'utf8')
  })
})
