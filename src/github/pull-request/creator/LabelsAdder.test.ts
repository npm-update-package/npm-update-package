import {
  afterEach,
  describe,
  expect,
  it,
  jest
} from '@jest/globals'
import type { GitRepository } from '../../../git'
import type { Options } from '../../../options'
import type { GitHub } from '../../GitHub'
import { LabelsAdder } from './LabelsAdder'

describe('LabelsAdder', () => {
  describe('add', () => {
    const addLabelsMock = jest.fn<GitHub['addLabels']>()
    const github = {
      addLabels: addLabelsMock
    } as unknown as GitHub
    const gitRepo = {
      owner: 'npm-update-package',
      name: 'example',
      url: 'https://github.com/npm-update-package/example'
    } as unknown as GitRepository
    const issueNumber = 1

    afterEach(() => {
      jest.resetAllMocks()
    })

    it('adds `npm-update-package` and additional labels if additionalLabels option exists', async () => {
      const options = {
        additionalLabels: ['bot', 'dependencies']
      } as unknown as Options
      const labelsAdder = new LabelsAdder({
        options,
        github,
        gitRepo
      })

      await labelsAdder.add(issueNumber)

      expect(addLabelsMock).toHaveBeenCalledWith({
        owner: gitRepo.owner,
        repo: gitRepo.name,
        issueNumber,
        labels: ['npm-update-package', 'bot', 'dependencies']
      })
    })

    it('adds only `npm-update-package` label if additionalLabels option does not exist', async () => {
      const options = {} as unknown as Options
      const labelsAdder = new LabelsAdder({
        options,
        github,
        gitRepo
      })

      await labelsAdder.add(issueNumber)

      expect(addLabelsMock).toHaveBeenCalledWith({
        owner: gitRepo.owner,
        repo: gitRepo.name,
        issueNumber,
        labels: ['npm-update-package']
      })
    })
  })
})
