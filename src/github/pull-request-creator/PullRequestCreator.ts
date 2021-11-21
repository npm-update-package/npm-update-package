import type { GitRepository } from '../../git'
import { logger } from '../../logger'
import type { OutdatedPackage } from '../../types'
import type { GitHub } from '../GitHub'
import type { Repository as GitHubRepository } from '../Repository'
import { createPullRequestBody } from './createPullRequestBody'
import { createPullRequestTitle } from './createPullRequestTitle'

// TODO: add test
export class PullRequestCreator {
  private readonly github: GitHub
  private readonly gitRepo: GitRepository
  private readonly githubRepo: GitHubRepository

  constructor ({
    github,
    gitRepo,
    githubRepo
  }: {
    github: GitHub
    gitRepo: GitRepository
    githubRepo: GitHubRepository
  }) {
    this.github = github
    this.gitRepo = gitRepo
    this.githubRepo = githubRepo
  }

  async create ({
    outdatedPackage,
    branchName
  }: {
    outdatedPackage: OutdatedPackage
    branchName: string
  }): Promise<void> {
    const title = createPullRequestTitle(outdatedPackage)
    logger.debug(`title=${title}`)

    const body = createPullRequestBody(outdatedPackage)
    logger.debug(`body=${body}`)

    const createdPullRequest = await this.github.createPullRequest({
      owner: this.gitRepo.owner,
      repo: this.gitRepo.name,
      base: this.githubRepo.default_branch,
      head: branchName,
      title,
      body
    })
    logger.debug(`createdPullRequest=${JSON.stringify(createdPullRequest)}`)
    logger.info(`Pull request for ${outdatedPackage.name} has created. ${createdPullRequest.html_url}`)
  }
}
