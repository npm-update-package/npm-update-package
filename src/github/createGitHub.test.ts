import { createGitHub } from './createGitHub'
import { GitHub } from './GitHub'

describe('createGitHub', () => {
  it('returns new GitHub instance', () => {
    const host = 'github.com'
    const token = 'token'
    const github = createGitHub({
      host,
      token
    })

    expect(github).toBeInstanceOf(GitHub)
  })
})
