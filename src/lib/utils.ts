// istanbul ignore file

export const sleep = async (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}
