import fs from 'node:fs'

// TODO: Add test
export const canReadWrite = async (path: string): Promise<boolean> => {
  try {
    await fs.promises.access(path, fs.constants.R_OK | fs.constants.W_OK)
  } catch {
    return false
  }

  return true
}
