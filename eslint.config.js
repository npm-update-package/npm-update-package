// @ts-check

import neostandard from 'neostandard'
import comments from '@eslint-community/eslint-plugin-eslint-comments/configs'

export default [
  ...neostandard({
    ts: true
  }),
  comments.recommended
]
