import assert from 'node:assert'
import {
  describe,
  it
} from 'node:test'
import { createGitHub } from './createGitHub.js'
import { GitHub } from './GitHub.js'

await describe('createGitHub', async () => {
  await it('returns new GitHub instance', () => {
    const actual = createGitHub({
      host: 'github.com',
      token: 'token'
    })

    assert.ok(actual instanceof GitHub)
  })
})
