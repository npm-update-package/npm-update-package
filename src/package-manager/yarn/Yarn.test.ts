// TODO: Replace Jest with Node.js's test runner

import {
  afterEach,
  describe,
  expect,
  it,
  jest
} from '@jest/globals'
import type { Terminal } from '../../terminal/Terminal.js'
import { Yarn } from './Yarn.js'

describe('Yarn', () => {
  const terminalRunMock = jest.fn<Terminal['run']>()
  const terminal = {
    run: terminalRunMock
  } as unknown as Terminal
  const yarn = new Yarn(terminal)

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getVersions', () => {
    describe('calls `yarn info <package-name> versions --json', () => {
      const packageName = '@npm-update-package/example'

      it('returns versions if stdout is valid', async () => {
        const expected = [
          '1.0.0',
          '2.0.0'
        ]
        terminalRunMock.mockResolvedValue(JSON.stringify({
          type: 'inspect',
          data: expected
        }))

        const actual = await yarn.getVersions(packageName)

        expect(actual).toEqual(expected)
        expect(terminalRunMock).toHaveBeenCalledWith('yarn', 'info', packageName, 'versions', '--json')
      })

      it('throws error if stdout is invalid', async () => {
        terminalRunMock.mockResolvedValue(JSON.stringify({}))

        await expect(async () => await yarn.getVersions(packageName)).rejects.toThrow(Error)

        expect(terminalRunMock).toHaveBeenCalledWith('yarn', 'info', packageName, 'versions', '--json')
      })
    })
  })

  describe('install', () => {
    it('calls `yarn install`', async () => {
      await yarn.install()

      expect(terminalRunMock).toHaveBeenCalledWith('yarn', 'install')
    })
  })
})
