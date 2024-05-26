import assert from 'node:assert'
import {
  describe,
  it,
  mock
} from 'node:test'
import sampleSize from 'lodash/sampleSize.js'
import type { GitRepository } from '../../../git/GitRepository.js'
import type { GitHub } from '../../GitHub.js'
import { ReviewersAdder } from './ReviewersAdder.js'

await describe('ReviewersAdder', async () => {
  await describe('add', async () => {
    const sampleSizeMock = mock.fn(sampleSize)
    const requestReviewersMock = mock.fn<GitHub['requestReviewers']>()
    const github = {
      requestReviewers: requestReviewersMock
    } as unknown as GitHub
    const gitRepo = {
      owner: 'npm-update-package',
      name: 'example',
      url: 'https://github.com/npm-update-package/example'
    } as unknown as GitRepository
    const pullNumber = 1
    const reviewers = ['alice', 'bob']

    // TODO: Activate when mock.module can use.
    await it.skip('adds all reviewers if size is not specified', async () => {
      const reviewersAdder = new ReviewersAdder({
        github,
        gitRepo
      })
      await reviewersAdder.add({
        pullNumber,
        reviewers
      })

      assert.strictEqual(sampleSizeMock.mock.callCount(), 0)
      assert.deepStrictEqual(sampleSizeMock.mock.calls.map(call => call.arguments), [])
      assert.strictEqual(requestReviewersMock.mock.callCount(), 1)
      assert.deepStrictEqual(requestReviewersMock.mock.calls.map(call => call.arguments), [
        [
          {
            owner: gitRepo.owner,
            repo: gitRepo.name,
            pullNumber,
            reviewers
          }
        ]
      ])
    })

    // TODO: Activate when mock.module can use.
    await it.skip('adds specified number of reviewers if size is specified', async () => {
      const github = {
        requestReviewers: requestReviewersMock
      } as unknown as GitHub
      const reviewersAdder = new ReviewersAdder({
        github,
        gitRepo
      })
      const size = 1
      sampleSizeMock.mock.mockImplementation(() => ['bob'])

      await reviewersAdder.add({
        pullNumber,
        reviewers,
        size
      })

      assert.strictEqual(sampleSizeMock.mock.callCount(), 1)
      assert.deepStrictEqual(sampleSizeMock.mock.calls.map(call => call.arguments), [
        [reviewers, size]
      ])
      assert.strictEqual(requestReviewersMock.mock.callCount(), 1)
      assert.deepStrictEqual(requestReviewersMock.mock.calls.map(call => call.arguments), [
        [
          {
            owner: gitRepo.owner,
            repo: gitRepo.name,
            pullNumber,
            reviewers: ['bob']
          }
        ]
      ])
    })
  })
})
