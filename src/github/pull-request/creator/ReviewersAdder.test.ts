import shuffle from 'lodash/shuffle'
import type { GitRepository } from '../../../git'
import type { GitHub } from '../../GitHub'
import { ReviewersAdder } from './ReviewersAdder'

jest.mock('lodash/shuffle')

describe('ReviewersAdder', () => {
  describe('add', () => {
    const shuffleMock = jest.mocked(shuffle)
    const requestReviewersMock = jest.fn()
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

    it('adds all reviewers if sampleSize is not specified', async () => {
      await reviewersAdder.add({
        pullNumber,
        reviewers
      })

      expect(shuffleMock).not.toBeCalled()
      expect(requestReviewersMock).toBeCalledWith({
        owner: gitRepo.owner,
        repo: gitRepo.name,
        pullNumber,
        reviewers
      })
    })

    it('adds specified number of reviewers if sampleSize is specified', async () => {
      shuffleMock.mockReturnValue(['bob', 'alice'])
      const sampleSize = 1

      await reviewersAdder.add({
        pullNumber,
        reviewers,
        sampleSize
      })

      expect(shuffleMock).toBeCalledWith(reviewers)
      expect(requestReviewersMock).toBeCalledWith({
        owner: gitRepo.owner,
        repo: gitRepo.name,
        pullNumber,
        reviewers: ['bob']
      })
    })
  })
})
