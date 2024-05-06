import {
  readFile,
  writeFile
} from 'node:fs/promises'

const packageJSON = JSON.parse(await readFile('./package.json', 'utf8'))
const appTS = await readFile('./src/app.ts', 'utf8')
const newAppTS = appTS.replace(/export const version = '.+'/, `export const version = '${packageJSON.version}'`)
await writeFile('./src/app.ts', newAppTS)
