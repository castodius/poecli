import { writeFileSync, readFileSync, existsSync } from 'fs'
import { homedir } from 'os'

import { variables } from '@helpers/env'

const storageFile = `${homedir()}/${variables.storageFile}`

type StorageObject = Record<string, string | number>;

/**
 * Fetches storage object from disk
 */
export const getStorageObject = (): StorageObject => {
  if (!existsSync(storageFile)) {
    return {}
  }

  const data = readFileSync(storageFile)
  return JSON.parse(data.toString())
}

/**
 * Writes storage object to disk
 * @param storageObject
 * Storage object with values as string or number
 */
export const putStorageObjct = (storageObject: StorageObject) => {
  writeFileSync(storageFile, JSON.stringify(storageObject))
}

/**
 * Adds key+value to storage object and stores it to disk
 * @param key
 * Key for which the value should be stored
 * @param value
 * Value to store
 */
export const write = (key: string, value: string | number) => {
  const storageObject: StorageObject = getStorageObject()
  storageObject[key] = value
  putStorageObjct(storageObject)
}

/**
 * Gets a value as string from storage
 * @param key
 * Key for which to fetch
 */
export const getValueAsString = (key: string): string => {
  const storageObject: StorageObject = getStorageObject()
  if (!storageObject[key]) {
    return ''
  }
  return storageObject[key].toString()
}
