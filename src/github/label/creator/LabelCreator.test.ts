import assert from 'node:assert'
import {
  afterEach,
  describe,
  it,
  mock
} from 'node:test'
import type { GitRepository } from '../../../git/GitRepository.js'
import { isNotFoundError } from '../../errors/NotFoundError.js'
import type {
  GitHub,
  Label
} from '../../GitHub.js'
import { LabelCreator } from './LabelCreator.js'

await describe('LabelCreator', async () => {
  // TODO: Activate when mock.module can use.
  await describe.skip('create', async () => {
    const isNotFoundErrorMock = mock.fn(isNotFoundError)
    const createLabelMock = mock.fn<GitHub['createLabel']>()
    const fetchLabelMock = mock.fn<GitHub['fetchLabel']>()
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
      isNotFoundErrorMock.mock.resetCalls()
      createLabelMock.mock.resetCalls()
      fetchLabelMock.mock.resetCalls()
    })

    await it('does not create label if it already exists', async () => {
      fetchLabelMock.mock.mockImplementation(async () => await Promise.resolve({
        name: 'npm-update-package'
      } as unknown as Label))

      await labelCreator.create({
        name: 'npm-update-package',
        description: 'Created by npm-update-package',
        color: 'A00F21'
      })

      assert.strictEqual(fetchLabelMock.mock.callCount(), 1)
      assert.deepStrictEqual(fetchLabelMock.mock.calls.map(call => call.arguments), [
        [
          {
            owner: gitRepo.owner,
            repo: gitRepo.name,
            name: 'npm-update-package'
          }
        ]
      ])
      assert.strictEqual(isNotFoundErrorMock.mock.callCount(), 0)
      assert.strictEqual(createLabelMock.mock.callCount(), 0)
    })

    await it('creates label if it does not exist', async () => {
      const error = new Error('error')
      fetchLabelMock.mock.mockImplementation(async () => await Promise.reject(error))
      isNotFoundErrorMock.mock.mockImplementation(async () => await Promise.resolve(true))

      await labelCreator.create({
        name: 'npm-update-package',
        description: 'Created by npm-update-package',
        color: 'A00F21'
      })

      assert.strictEqual(fetchLabelMock.mock.callCount(), 1)
      assert.deepStrictEqual(fetchLabelMock.mock.calls.map(call => call.arguments), [
        [
          {
            owner: gitRepo.owner,
            repo: gitRepo.name,
            name: 'npm-update-package'
          }
        ]
      ])
      assert.strictEqual(isNotFoundErrorMock.mock.callCount(), 1)
      assert.deepStrictEqual(isNotFoundErrorMock.mock.calls.map(call => call.arguments), [
        [error]
      ])
      assert.strictEqual(createLabelMock.mock.callCount(), 1)
      assert.deepStrictEqual(createLabelMock.mock.calls.map(call => call.arguments), [
        [
          {
            owner: gitRepo.owner,
            repo: gitRepo.name,
            name: 'npm-update-package',
            description: 'Created by npm-update-package',
            color: 'A00F21'
          }
        ]
      ])
    })

    await it('throws error if it occurred when fetching label', async () => {
      const error = new Error('error')
      fetchLabelMock.mock.mockImplementation(async () => await Promise.reject(error))
      isNotFoundErrorMock.mock.mockImplementation(async () => await Promise.resolve(false))

      assert.throws(async () => {
        await labelCreator.create({
          name: 'npm-update-package',
          description: 'Created by npm-update-package',
          color: 'A00F21'
        })
      }, error)

      assert.strictEqual(fetchLabelMock.mock.callCount(), 1)
      assert.deepStrictEqual(fetchLabelMock.mock.calls.map(call => call.arguments), [
        [
          {
            owner: gitRepo.owner,
            repo: gitRepo.name,
            name: 'npm-update-package'
          }
        ]
      ])
      assert.strictEqual(isNotFoundErrorMock.mock.callCount(), 1)
      assert.deepStrictEqual(isNotFoundErrorMock.mock.calls.map(call => call.arguments), [
        [error]
      ])
      assert.strictEqual(createLabelMock.mock.callCount(), 0)
    })
  })
})
