import assert from 'node:assert'
import {
  afterEach,
  describe,
  it,
  mock
} from 'node:test'
import type { GitRepository } from '../../../git/GitRepository.js'
import type { Options } from '../../../options/Options.js'
import type { GitHub } from '../../GitHub.js'
import { LabelsAdder } from './LabelsAdder.js'

await describe('LabelsAdder', async () => {
  await describe('add', async () => {
    const addLabelsMock = mock.fn<GitHub['addLabels']>()
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
      addLabelsMock.mock.resetCalls()
    })

    await it('adds `npm-update-package` and additional labels if additionalLabels option exists', async () => {
      const options = {
        additionalLabels: ['bot', 'dependencies']
      } as unknown as Options
      const labelsAdder = new LabelsAdder({
        options,
        github,
        gitRepo
      })

      await labelsAdder.add(issueNumber)

      assert.strictEqual(addLabelsMock.mock.callCount(), 1)
      assert.deepStrictEqual(addLabelsMock.mock.calls.map(call => call.arguments), [
        [
          {
            owner: gitRepo.owner,
            repo: gitRepo.name,
            issueNumber,
            labels: ['npm-update-package', 'bot', 'dependencies']
          }
        ]
      ])
    })

    await it('adds only `npm-update-package` label if additionalLabels option does not exist', async () => {
      const options = {} as unknown as Options
      const labelsAdder = new LabelsAdder({
        options,
        github,
        gitRepo
      })

      await labelsAdder.add(issueNumber)

      assert.strictEqual(addLabelsMock.mock.callCount(), 1)
      assert.deepStrictEqual(addLabelsMock.mock.calls.map(call => call.arguments), [
        [
          {
            owner: gitRepo.owner,
            repo: gitRepo.name,
            issueNumber,
            labels: ['npm-update-package']
          }
        ]
      ])
    })
  })
})
