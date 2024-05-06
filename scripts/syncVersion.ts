import {
  readFile,
  writeFile
} from 'node:fs/promises'

const packageJSON = JSON.parse(await readFile('./package.json', 'utf8'))
const currentVersion = packageJSON.version
const appTS = await readFile('./src/app.ts', 'utf8')
const newAppTS = appTS.replace(/export const version = '.+'/, `export const version = '${currentVersion}'`)
await writeFile('./src/app.ts', newAppTS)
