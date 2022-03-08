import {
  isNcuResult,
  type NcuResult
} from './NcuResult'

describe('isNcuResult', () => {
  const result: NcuResult = {
    '@npm-update-package/example': '1.0.0'
  }

  it('returns true if value is NcuResult', () => {
    expect(isNcuResult(result)).toBe(true)
  })

  it('returns false if value is not NcuResult', () => {
    expect(isNcuResult(JSON.stringify(result))).toBe(false)
  })
})
