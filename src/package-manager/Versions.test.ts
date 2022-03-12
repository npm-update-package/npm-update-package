import {
  isVersions,
  type Versions
} from './Versions'

describe('isVersions', () => {
  const versions: Versions = [
    '1.0.0',
    '2.0.0'
  ]

  it('returns true if value is Versions', () => {
    expect(isVersions(versions)).toBe(true)
  })

  it('returns false if value is not Versions', () => {
    expect(isVersions(JSON.stringify(versions))).toBe(false)
  })
})
