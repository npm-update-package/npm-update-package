import {
  afterEach,
  describe,
  expect,
  it,
  jest
} from '@jest/globals'
import sampleSize from 'lodash/sampleSize.js'
import type { GitRepository } from '../../../git/GitRepository.js'
import type { GitHub } from '../../GitHub.js'
import { AssigneesAdder } from './AssigneesAdder.js'

jest.mock('lodash/sampleSize.js')

describe('AssigneesAdder', () => {
  describe('add', () => {
    const sampleSizeMock = jest.mocked(sampleSize)
    const addAssigneesMock = jest.fn<GitHub['addAssignees']>()
    const github = {
      addAssignees: addAssigneesMock
    } as unknown as GitHub
    const gitRepo = {
      owner: 'npm-update-package',
      name: 'example',
      url: 'https://github.com/npm-update-package/example'
    } as unknown as GitRepository
    const assigneesAdder = new AssigneesAdder({
      github,
      gitRepo
    })
    const issueNumber = 1
    const assignees = ['alice', 'bob']

    afterEach(() => {
      jest.resetAllMocks()
    })

    it('adds all assignees if size is not specified', async () => {
      await assigneesAdder.add({
        issueNumber,
        assignees
      })

      expect(sampleSizeMock).not.toHaveBeenCalled()
      expect(addAssigneesMock).toHaveBeenCalledWith({
        owner: gitRepo.owner,
        repo: gitRepo.name,
        issueNumber,
        assignees
      })
    })

    it('adds specified number of assignees if size is specified', async () => {
      sampleSizeMock.mockReturnValue(['bob'])
      const size = 1

      await assigneesAdder.add({
        issueNumber,
        assignees,
        size
      })

      expect(sampleSizeMock).toHaveBeenCalledWith(assignees, size)
      expect(addAssigneesMock).toHaveBeenCalledWith({
        owner: gitRepo.owner,
        repo: gitRepo.name,
        issueNumber,
        assignees: ['bob']
      })
    })
  })
})
