import { GitRepository } from '../git'
import { createGitHub } from './createGitHub'
import { GitHub } from './GitHub'

describe('createGitHub', () => {
  it('returns new GitHub instance', () => {
    const repository = GitRepository.of('https://github.com/npm-update-package/npm-update-package.git')
    const token = 'token'
    const github = createGitHub({
      repository,
      token
    })

    expect(github).toBeInstanceOf(GitHub)
  })
})
