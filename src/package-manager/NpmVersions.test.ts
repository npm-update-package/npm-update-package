import {
  isNpmVersions,
  type NpmVersions
} from './NpmVersions'

describe('isNpmVersions', () => {
  const versions: NpmVersions = [
    '1.0.0',
    '2.0.0'
  ]

  it('returns true if value is NpmVersions', () => {
    expect(isNpmVersions(versions)).toBe(true)
  })

  it('returns false if value is not NpmVersions', () => {
    expect(isNpmVersions(JSON.stringify(versions))).toBe(false)
  })
})
