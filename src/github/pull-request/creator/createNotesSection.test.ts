// TODO: Replace Jest with Node.js's test runner

import {
  describe,
  expect,
  it
} from '@jest/globals'
import { createNotesSection } from './createNotesSection.js'

describe('createNotesSection', () => {
  it('returns Notes section', () => {
    const notes = '**:warning: Please see diff and release notes before merging.**'
    const actual = createNotesSection(notes)

    expect(actual).toBe(`## Notes

${notes}`)
  })
})
