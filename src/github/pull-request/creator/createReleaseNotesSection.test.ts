import type { Release } from '../../releases'
import { createReleaseNotesSection } from './createReleaseNotesSection'

describe('createReleaseNotesSection', () => {
  it('returns release notes section', () => {
    const releases: Release[] = [
      {
        tag: 'v1.0.0',
        url: 'https://github.com/npm-update-package/example/releases/tag/v1.0.0'
      },
      {
        tag: 'v2.0.0',
        url: 'https://github.com/npm-update-package/example/releases/tag/v2.0.0'
      }
    ]

    const actual = createReleaseNotesSection(releases)

    expect(actual).toBe(`## Release notes

- [v1.0.0](https://togithub.com/npm-update-package/example/releases/tag/v1.0.0)
- [v2.0.0](https://togithub.com/npm-update-package/example/releases/tag/v2.0.0)`)
  })
})
