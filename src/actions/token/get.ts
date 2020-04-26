import { getToken } from '@helpers/config'
import * as log from '@lib/log'

/**
 * Retrieves token from storage and prints it
 */
export const get = async (): Promise<void> => {
  const token: string = getToken()
  log.info(token)
}
