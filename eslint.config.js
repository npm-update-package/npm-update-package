// @ts-check

import { globalIgnores } from 'eslint/config'
import neostandard from 'neostandard'
import comments from '@eslint-community/eslint-plugin-eslint-comments/configs'

export default [
  globalIgnores(['dist/']),
  ...neostandard({
    ts: true
  }),
  comments.recommended
]
