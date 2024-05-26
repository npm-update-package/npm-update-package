import assert from 'node:assert'
import {
  describe,
  it
} from 'node:test'
import { createNotesSection } from './createNotesSection.js'

await describe('createNotesSection', async () => {
  await it('returns Notes section', () => {
    const notes = '**:warning: Please see diff and release notes before merging.**'

    const actual = createNotesSection(notes)

    assert.strictEqual(actual, `## Notes

${notes}`)
  })
})
