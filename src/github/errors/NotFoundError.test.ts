import {
  describe,
  expect,
  it
} from '@jest/globals'
import { RequestError } from '@octokit/request-error'
import type { RequestOptions } from '@octokit/types'
import { StatusCodes } from 'http-status-codes'
import { isNotFoundError } from './NotFoundError'

describe('isNotFoundError', () => {
  describe('returns whether value is NotFoundError', () => {
    interface TestCase {
      error: Error
      expected: boolean
    }
    const request: RequestOptions = {
      method: 'GET',
      url: 'https://example.test/',
      headers: {}
    }
    const options = { request }
    const cases: TestCase[] = [
      {
        error: new RequestError('test message', StatusCodes.NOT_FOUND, options),
        expected: true
      },
      {
        error: new RequestError('test message', StatusCodes.BAD_REQUEST, options),
        expected: false
      },
      {
        error: new Error('test message'),
        expected: false
      }
    ]

    it.each(cases)('error=$error', ({ error, expected }) => {
      const actual = isNotFoundError(error)

      expect(actual).toBe(expected)
    })
  })
})
