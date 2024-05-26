import assert from 'node:assert'
import {
  describe,
  it
} from 'node:test'
import { RequestError } from '@octokit/request-error'
import type { RequestOptions } from '@octokit/types'
import { StatusCodes } from 'http-status-codes'
import { isNotFoundError } from './NotFoundError.js'

await describe('isNotFoundError', async () => {
  await describe('returns whether value is NotFoundError', async () => {
    const { each } = await import('test-each')
    const request: RequestOptions = {
      method: 'GET',
      url: 'https://example.test/',
      headers: {}
    }
    const options = { request }
    const inputs: Array<[error: Error, expected: boolean]> = [
      [new RequestError('test message', StatusCodes.NOT_FOUND, options), true],
      [new RequestError('test message', StatusCodes.BAD_REQUEST, options), false],
      [new Error('test message'), false]
    ]
    each(inputs, ({ title }, [error, expected]) => {
      void it(title, () => {
        const actual = isNotFoundError(error)

        assert.strictEqual(actual, expected)
      })
    })
  })
})
