import shuffle from 'lodash/shuffle'
import type { GitRepository } from '../../../git'
import type { GitHub } from '../../GitHub'
import { AssigneesAdder } from './AssigneesAdder'

jest.mock('lodash/shuffle')

describe('AssigneesAdder', () => {
  describe('add', () => {
    const shuffleMock = jest.mocked(shuffle)
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

    it('adds all assignees if sampleSize is not specified', async () => {
      await assigneesAdder.add({
        issueNumber,
        assignees
      })

      expect(shuffleMock).not.toBeCalled()
      expect(addAssigneesMock).toBeCalledWith({
        owner: gitRepo.owner,
        repo: gitRepo.name,
        issueNumber,
        assignees
      })
    })

    it('adds specified number of assignees if sampleSize is specified', async () => {
      shuffleMock.mockReturnValue(['bob', 'alice'])
      const sampleSize = 1

      await assigneesAdder.add({
        issueNumber,
        assignees,
        sampleSize
      })

      expect(shuffleMock).toBeCalledWith(assignees)
      expect(addAssigneesMock).toBeCalledWith({
        owner: gitRepo.owner,
        repo: gitRepo.name,
        issueNumber,
        assignees: ['bob']
      })
    })
  })
})
