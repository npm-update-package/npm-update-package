import {
  afterEach,
  describe,
  expect,
  it,
  jest
} from '@jest/globals'
import type { GitRepository } from '../../../git'
import { isNotFoundError } from '../../errors'
import type {
  GitHub,
  Label
} from '../../GitHub'
import { LabelCreator } from './LabelCreator'

jest.mock('../../errors')

describe('LabelCreator', () => {
  describe('create', () => {
    const isNotFoundErrorMock = jest.mocked(isNotFoundError)
    const createLabelMock = jest.fn<GitHub['createLabel']>()
    const fetchLabelMock = jest.fn<GitHub['fetchLabel']>()
    const github = {
      createLabel: createLabelMock,
      fetchLabel: fetchLabelMock
    } as unknown as GitHub
    const gitRepo = {
      owner: 'npm-update-package',
      name: 'example'
    } as unknown as GitRepository
    const labelCreator = new LabelCreator({
      github,
      gitRepo
    })

    afterEach(() => {
      jest.resetAllMocks()
    })

    it('does not create label if it already exists', async () => {
      fetchLabelMock.mockResolvedValue({
        name: 'npm-update-package'
      } as unknown as Label)

      await labelCreator.create({
        name: 'npm-update-package',
        description: 'Created by npm-update-package',
        color: 'A00F21'
      })

      expect(fetchLabelMock).toHaveBeenCalledWith({
        owner: gitRepo.owner,
        repo: gitRepo.name,
        name: 'npm-update-package'
      })
      expect(isNotFoundErrorMock).not.toHaveBeenCalled()
      expect(createLabelMock).not.toHaveBeenCalled()
    })

    it('creates label if it does not exist', async () => {
      const error = new Error()
      fetchLabelMock.mockRejectedValue(error)
      isNotFoundErrorMock.mockReturnValue(true)

      await labelCreator.create({
        name: 'npm-update-package',
        description: 'Created by npm-update-package',
        color: 'A00F21'
      })

      expect(fetchLabelMock).toHaveBeenCalledWith({
        owner: gitRepo.owner,
        repo: gitRepo.name,
        name: 'npm-update-package'
      })
      expect(isNotFoundErrorMock).toHaveBeenCalledWith(error)
      expect(createLabelMock).toHaveBeenCalledWith({
        owner: gitRepo.owner,
        repo: gitRepo.name,
        name: 'npm-update-package',
        description: 'Created by npm-update-package',
        color: 'A00F21'
      })
    })

    it('throws error if it occurred when fetching label', async () => {
      const error = new Error()
      fetchLabelMock.mockRejectedValue(error)
      isNotFoundErrorMock.mockReturnValue(false)

      await expect(labelCreator.create({
        name: 'npm-update-package',
        description: 'Created by npm-update-package',
        color: 'A00F21'
      })).rejects.toThrow(error)

      expect(fetchLabelMock).toHaveBeenCalledWith({
        owner: gitRepo.owner,
        repo: gitRepo.name,
        name: 'npm-update-package'
      })
      expect(isNotFoundErrorMock).toHaveBeenCalledWith(error)
      expect(createLabelMock).not.toHaveBeenCalled()
    })
  })
})
