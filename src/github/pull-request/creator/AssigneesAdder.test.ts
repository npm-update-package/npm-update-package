import sampleSize from 'lodash/sampleSize'
import type { GitRepository } from '../../../git'
import type { GitHub } from '../../GitHub'
import { AssigneesAdder } from './AssigneesAdder'

jest.mock('lodash/sampleSize')

describe('AssigneesAdder', () => {
  describe('add', () => {
    const sampleSizeMock = jest.mocked(sampleSize)
    const addAssigneesMock = jest.fn()
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
