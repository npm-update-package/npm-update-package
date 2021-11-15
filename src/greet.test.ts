import { greet } from './greet'

describe('greet', () => {
  it('returns greeting', () => {
    expect(greet('World')).toBe('Hello World')
  })
})
