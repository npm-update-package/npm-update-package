import assert from 'node:assert'
import {
  afterEach,
  describe,
  it,
  mock
} from 'node:test'
import sampleSize from 'lodash/sampleSize.js'
import type { GitRepository } from '../../../git/GitRepository.js'
import type { GitHub } from '../../GitHub.js'
import { AssigneesAdder } from './AssigneesAdder.js'

await describe('AssigneesAdder', async () => {
  await describe('add', async () => {
    const sampleSizeMock = mock.fn(sampleSize)
    const addAssigneesMock = mock.fn<GitHub['addAssignees']>()
    const github = {
      addAssignees: addAssigneesMock
    } as unknown as GitHub
    const gitRepo = {
      owner: 'npm-update-package',
      name: 'example',
      url: 'https://github.com/npm-update-package/example'
    } as unknown as GitRepository
    const issueNumber = 1
    const assignees = ['alice', 'bob']

    afterEach(() => {
      sampleSizeMock.mock.resetCalls()
      addAssigneesMock.mock.resetCalls()
    })

    // TODO: Activate when mock.module can use.
    await it.skip('adds all assignees if size is not specified', async () => {
      const assigneesAdder = new AssigneesAdder({
        github,
        gitRepo
      })
      await assigneesAdder.add({
        issueNumber,
        assignees
      })

      assert.strictEqual(sampleSizeMock.mock.callCount(), 0)
      assert.deepStrictEqual(sampleSizeMock.mock.calls.map(call => call.arguments), [])
      assert.strictEqual(addAssigneesMock.mock.callCount(), 1)
      assert.deepStrictEqual(addAssigneesMock.mock.calls.map(call => call.arguments), [
        [
          {
            owner: gitRepo.owner,
            repo: gitRepo.name,
            issueNumber,
            assignees
          }
        ]
      ])
    })

    // TODO: Activate when mock.module can use.
    await it.skip('adds specified number of assignees if size is specified', async () => {
      const assigneesAdder = new AssigneesAdder({
        github,
        gitRepo
      })
      const size = 1
      sampleSizeMock.mock.mockImplementation(() => ['bob'])

      await assigneesAdder.add({
        issueNumber,
        assignees,
        size
      })

      assert.strictEqual(sampleSizeMock.mock.callCount(), 1)
      assert.deepStrictEqual(sampleSizeMock.mock.calls.map(call => call.arguments), [
        [assignees, size]
      ])
      assert.strictEqual(addAssigneesMock.mock.callCount(), 1)
      assert.deepStrictEqual(addAssigneesMock.mock.calls.map(call => call.arguments), [
        [
          {
            owner: gitRepo.owner,
            repo: gitRepo.name,
            issueNumber,
            assignees: ['bob']
          }
        ]
      ])
    })
  })
})
