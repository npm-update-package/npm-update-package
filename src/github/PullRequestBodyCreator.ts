import { render } from 'mustache'
import { app } from '../app'
import type { OutdatedPackage } from '../ncu'

export class PullRequestBodyCreator {
  private readonly template = `This PR updates these packages:

|package|type|current version|new version|
|---|---|---|---|
|[{{{packageName}}}](https://www.npmjs.com/package/{{{packageName}}})|{{updateType}}|\`{{currentVersion}}\`|\`{{newVersion}}\`|

<details>
<summary>Metadata</summary>

**Don't remove or edit this section because it will be used by npm-update-package.**

<div id="npm-update-package-metadata">

\`\`\`json
{
  "version": "{{appVersion}}",
  "packages": [
    {
      "name": "{{{packageName}}}",
      "type": "{{updateType}}",
      "currentVersion": "{{currentVersion}}",
      "newVersion": "{{newVersion}}"
    }
  ]
}
\`\`\`

</div>
</details>

---
This PR has been generated by [{{{appName}}}]({{{appWeb}}}) v{{appVersion}}`

  create (outdatedPackage: OutdatedPackage): string {
    const appName = app.name
    const appVersion = app.version
    const appWeb = app.web
    const currentVersion = outdatedPackage.currentVersion.version
    const newVersion = outdatedPackage.newVersion.version
    const packageName = outdatedPackage.name
    const updateType = outdatedPackage.type
    return render(this.template, {
      appName,
      appVersion,
      appWeb,
      currentVersion,
      newVersion,
      packageName,
      updateType
    })
  }
}
