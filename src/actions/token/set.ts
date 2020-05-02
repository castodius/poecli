import { setToken } from '@helpers/config'
import { POEditor } from '@lib/poeditor'
import * as log from '@lib/log'
import { promptInput } from '@helpers/prompt'

/**
 * Gets, verifies and sets a token
 */
export const set = async (): Promise<void> => {
  const token = await getToken()

  setToken(token)
  log.info('Token verified and stored')
}

/**
 * Forces the user to input a token. Runs until a valid token has been input
 */
export const getToken = async (): Promise<string> => {
  while (true) {
    const token = await promptInput('Input your POEditor token', '', validate)

    if (await verifyToken(token)) {
      return token
    }
  }
}

/**
 * Verifies a token by running list projects
 * @param token
 * POEditor token
 */
export const verifyToken = async (token: string): Promise<boolean> => {
  const poe = new POEditor(token)

  try {
    await poe.listProjects()
    return true
  } catch (err) {
    log.info('Token verifiation failed. Message from POEditor: ' + err.message)
    return false
  }
}

/**
 * Validates that the token is defined and consists of 32 hexadecimal characters
 * @param value
 */
export const validate = (value: string): boolean | string => {
  if (!value.match(/^[0-9a-f]+$/)) {
    return 'Please input a token consisting of numbers and the letters a through f'
  }

  if (value.length !== 32) {
    return 'Please input a token of length 32 (POEditor standard)'
  }

  return true
}
