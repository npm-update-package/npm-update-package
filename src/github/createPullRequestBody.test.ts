import { UpdateType } from '../enums'
import { PackageVersion } from '../values'
import { createPullRequestBody } from './createPullRequestBody'

describe('createPullRequestBody', () => {
  describe('if update type is patch', () => {
    it('returns pull request body', () => {
      const actual = createPullRequestBody({
        name: '@typescript-eslint/eslint-plugin',
        currentVersion: PackageVersion.of('1.0.0'),
        newVersion: PackageVersion.of('1.0.1'),
        type: UpdateType.Patch
      })
      expect(actual).toBe(`This PR updates these packages:

|package|type|current version|new version|
|---|---|---|---|
|[@typescript-eslint/eslint-plugin](https://www.npmjs.com/package/@typescript-eslint/eslint-plugin)|patch|\`1.0.0\`|\`1.0.1\`|

---
This PR has been generated by [npm-update-package](https://github.com/munierujp/npm-update-package)`)
    })
  })

  describe('if update type is minor', () => {
    it('returns pull request body', () => {
      const actual = createPullRequestBody({
        name: '@typescript-eslint/eslint-plugin',
        currentVersion: PackageVersion.of('1.0.0'),
        newVersion: PackageVersion.of('1.1.0'),
        type: UpdateType.Minor
      })
      expect(actual).toBe(`This PR updates these packages:

|package|type|current version|new version|
|---|---|---|---|
|[@typescript-eslint/eslint-plugin](https://www.npmjs.com/package/@typescript-eslint/eslint-plugin)|minor|\`1.0.0\`|\`1.1.0\`|

---
This PR has been generated by [npm-update-package](https://github.com/munierujp/npm-update-package)`)
    })
  })

  describe('if update type is major', () => {
    it('returns pull request body', () => {
      const actual = createPullRequestBody({
        name: '@typescript-eslint/eslint-plugin',
        currentVersion: PackageVersion.of('1.0.0'),
        newVersion: PackageVersion.of('2.0.0'),
        type: UpdateType.Major
      })
      expect(actual).toBe(`This PR updates these packages:

|package|type|current version|new version|
|---|---|---|---|
|[@typescript-eslint/eslint-plugin](https://www.npmjs.com/package/@typescript-eslint/eslint-plugin)|major|\`1.0.0\`|\`2.0.0\`|

---
This PR has been generated by [npm-update-package](https://github.com/munierujp/npm-update-package)`)
    })
  })
})
