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
    readFileMock.mockReset()
  })

  it('calls fs.promises.readFile()', async () => {
    const expected = JSON.stringify({
      name: '@npm-update-package/example',
      version: '1.0.0'
    })
    readFileMock.mockResolvedValue(expected)
    const path = 'package.json'

    const actual = await readFile(path)

    expect(actual).toBe(expected)
    expect(readFileMock).toBeCalledWith(path, 'utf8')
  })
})
