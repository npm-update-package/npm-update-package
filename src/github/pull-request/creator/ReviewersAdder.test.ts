import {
  afterEach,
  describe,
  expect,
  it,
  jest
} from '@jest/globals'
import type { GitRepository } from '../../../git/GitRepository.js'
import { sampleSize } from '../../../util/sampleSize.js'
import type { GitHub } from '../../GitHub.js'
import { ReviewersAdder } from './ReviewersAdder.js'

jest.mock('../../../util/sampleSize.js')

describe('ReviewersAdder', () => {
  describe('add', () => {
    const sampleSizeMock = jest.mocked(sampleSize)
    const requestReviewersMock = jest.fn<GitHub['requestReviewers']>()
    const github = {
      requestReviewers: requestReviewersMock
    } as unknown as GitHub
    const gitRepo = {
      owner: 'npm-update-package',
      name: 'example',
      url: 'https://github.com/npm-update-package/example'
    } as unknown as GitRepository
    const reviewersAdder = new ReviewersAdder({
      github,
      gitRepo
    })
    const pullNumber = 1
    const reviewers = ['alice', 'bob']

    afterEach(() => {
      jest.resetAllMocks()
    })

    it('adds all reviewers if size is not specified', async () => {
      await reviewersAdder.add({
        pullNumber,
        reviewers
      })

      expect(sampleSizeMock).not.toHaveBeenCalled()
      expect(requestReviewersMock).toHaveBeenCalledWith({
        owner: gitRepo.owner,
        repo: gitRepo.name,
        pullNumber,
        reviewers
      })
    })

    it('adds specified number of reviewers if size is specified', async () => {
      sampleSizeMock.mockReturnValue(['bob'])
      const size = 1

      await reviewersAdder.add({
        pullNumber,
        reviewers,
        size
      })

      expect(sampleSizeMock).toHaveBeenCalledWith(reviewers, size)
      expect(requestReviewersMock).toHaveBeenCalledWith({
        owner: gitRepo.owner,
        repo: gitRepo.name,
        pullNumber,
        reviewers: ['bob']
      })
    })
  })
})
