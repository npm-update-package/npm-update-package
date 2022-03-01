import { RequestError } from '@octokit/request-error'
import type { RequestOptions } from '@octokit/types'
import { StatusCodes } from 'http-status-codes'
import { isNotFoundError } from './NotFoundError'

describe('isNotFoundError', () => {
  describe('if value is instance of RequestError', () => {
    const message = 'test message'
    const request: RequestOptions = {
      method: 'GET',
      url: 'https://example.com/',
      headers: {}
    }
    const options = { request }

    it(`returns true if status is ${StatusCodes.NOT_FOUND}`, () => {
      const error = new RequestError(message, StatusCodes.NOT_FOUND, options)
      expect(isNotFoundError(error)).toBe(true)
    })

    it(`returns false if status is not ${StatusCodes.NOT_FOUND}`, () => {
      const error = new RequestError(message, StatusCodes.BAD_REQUEST, options)
      expect(isNotFoundError(error)).toBe(false)
    })
  })

  it('returns false if value is not instance of RequestError', () => {
    const error = new Error()
    expect(isNotFoundError(error)).toBe(false)
  })
})
