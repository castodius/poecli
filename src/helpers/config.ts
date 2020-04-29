// istanbul ignore file

import { getValueAsString, write } from '@helpers/storage'

// models
import { StorageNames } from '@models/storage'

/**
 * Returns a token from storage
 */
export const getToken = (): string => {
  return getValueAsString(StorageNames.TOKEN)
}

/**
 * Writes a token to storage
 * @param token
 * POEditor API token. Can be generated here: https://poeditor.com/account/api
 */
export const setToken = (token: string): void => {
  write(StorageNames.TOKEN, token)
}
