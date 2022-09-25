export const sleep = async (ms: number): Promise<void> => {
  return await new Promise(resolve => setTimeout(resolve, ms))
}
