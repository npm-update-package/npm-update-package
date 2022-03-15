import {
  isYarnVersions,
  type YarnVersions
} from './YarnVersions'

describe('isYarnVersions', () => {
  const versions: YarnVersions = {
    type: 'inspect',
    data: [
      '1.0.0',
      '2.0.0'
    ]
  }

  it('returns true if value is YarnVersions', () => {
    expect(isYarnVersions(versions)).toBe(true)
  })

  it('returns false if value is not YarnVersions', () => {
    expect(isYarnVersions(JSON.stringify(versions))).toBe(false)
  })
})
