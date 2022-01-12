import { coerce } from 'semver'

export class SemVer {
  readonly version: string
  readonly major: number
  readonly minor: number
  readonly patch: number

  private constructor ({
    version,
    major,
    minor,
    patch
  }: {
    version: string
    major: number
    minor: number
    patch: number
  }) {
    this.version = version
    this.major = major
    this.minor = minor
    this.patch = patch
  }

  static of (version: string): SemVer {
    const semver = coerce(version)

    if (semver === null) {
      throw new Error(`Failed to parse version. version=${version}`)
    }

    return new SemVer({
      version: semver.version,
      major: semver.major,
      minor: semver.minor,
      patch: semver.patch
    })
  }
}
