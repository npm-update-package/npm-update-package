import {
  describe,
  expect,
  it
} from '@jest/globals'
import { createGitHub } from './createGitHub.js'
import { GitHub } from './GitHub.js'

describe('createGitHub', () => {
  it('returns new GitHub instance', () => {
    const host = 'github.com'
    const token = 'token'

    const actual = createGitHub({
      host,
      token
    })

    expect(actual).toBeInstanceOf(GitHub)
  })
})
