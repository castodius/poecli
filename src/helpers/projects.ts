import * as log from '@lib/log'

import { POEditor } from '@lib/poeditor'
import { CompactProject, FileType, UpdateType, POBoolean, UpdateTagObject, UpdateTag } from '@models/poeditor'
import { selectAuto, buildStringSourceFunction, getConfirmation, Choice, selectCheckboxPlus, buildChoiceSourceFunction } from './prompt'
import { readdirSync } from 'fs'
import { selectProjectLanguage } from './poeditor'
import { inputTags } from './terms'

type POBooleanUndefined = POBoolean | undefined
const allowedFileFormats = Object.values(FileType)

export const uploadProjectFile = async (poe: POEditor, project: CompactProject): Promise<void> => {
  const file: string | undefined = await selectFile()
  if (!file) {
    log.info('The directory you are currently located in does not contain any valid files. Here is the list of allowed formats:')
    log.info(JSON.stringify(allowedFileFormats))
    return
  }

  const updating: UpdateType = (await selectAuto('Select update type', buildStringSourceFunction(Object.values(UpdateType)))) as UpdateType

  const language: string | undefined = await getLanguage(updating, project.id, poe)
  const overwrite: POBooleanUndefined = await getOverwrite(updating)
  const syncTerms: POBooleanUndefined = await getSyncTerms(updating)
  const readFromSource: POBooleanUndefined = await getReadFromSource(file)
  const fuzzyTrigger: POBoolean = await getFuzzyTrigger()
  const tags: UpdateTagObject | undefined = await getTags(updating)
  const data = await poe.uploadProject({
    id: project.id,
    updating,
    file: `${process.cwd()}/${file}`,
    language,
    overwrite,
    sync_terms: syncTerms,
    read_from_source: readFromSource,
    fuzzy_trigger: fuzzyTrigger,
    tags
  })

  log.info('Project file successfully uploaded and parsed')
  log.info(JSON.stringify(data))
}

export const selectFile = async (): Promise<string | undefined> => {
  const unfilteredFiles = readdirSync(process.cwd())

  const files = unfilteredFiles.filter((filename: string) => {
    return allowedFileFormats.some((fileFormat: string) => {
      return filename.endsWith(`.${fileFormat}`)
    })
  })

  if (!files.length) {
    return
  }

  return selectAuto('Select a file', buildStringSourceFunction(files))
}

/**
 * Gets language which should be updated
 * @param updating
 * Type of update. terms, terms_translations or translations
 * @param id
 * Project id
 * @param poe
 * POEditor instance
 */
export const getLanguage = async (updating: UpdateType, id: number, poe: POEditor): Promise<string | undefined> => {
  if (updating === UpdateType.TERMS) {
    return
  }

  return (await selectProjectLanguage(poe, id))?.code
}

/**
 * Forces the user to make a decision on whether or not to overwrite translations
 * @param updating
 * Type of update. terms, terms_translations or translations
 */
export const getOverwrite = async (updating: UpdateType): Promise<POBooleanUndefined> => {
  if (updating === UpdateType.TERMS) {
    return
  }

  const overwrite = await getConfirmation('Do you want to overwrite existing translations in the project?')

  return overwrite ? 1 : 0
}

/**
 * Forces the user to make a decision on whether or not to sync terms
 * @param updating
 * Type of update. terms, terms_translations or translations
 */
export const getSyncTerms = async (updating: UpdateType): Promise<POBooleanUndefined> => {
  if (updating === UpdateType.TRANSLATIONS) {
    return
  }

  const syncTerms = await getConfirmation('Do you want to sync terms? Syncing terms will remove from the project which are not present in your file.')

  return syncTerms ? 1 : 0
}

/**
 * Forces the user to specify if they want to read from source for XLIFF files
 * @param file
 * Filename. For example file.xliff
 */
export const getReadFromSource = async (file: string): Promise<POBooleanUndefined> => {
  if (!file.endsWith(FileType.XLIFF)) {
    return
  }

  const readFromSource = await getConfirmation('Do you want to import translations from the source tag?')

  return readFromSource ? 1 : 0
}

/**
 * Forces the user to make a decision on fuzzy trigger
 */
export const getFuzzyTrigger = async (): Promise<POBoolean> => {
  const fuzzyTrigger = await getConfirmation('Do you want to mark translations for other languages as fuzzy?')

  return fuzzyTrigger ? 1 : 0
}

/**
 * Forces the user to input tags
 * @param updating
 * Type of update. terms, terms_translations or translations
 */
export const getTags = async (updating: UpdateType): Promise<UpdateTagObject | undefined> => {
  if (updating === UpdateType.TRANSLATIONS) {
    return
  }

  const choices: Choice<UpdateTag>[] = [{
    name: 'All',
    value: UpdateTag.ALL
  }, {
    name: 'New - terms which are in the file but not in the project',
    value: UpdateTag.NEW
  }, {
    name: 'Obsolete - terms which are in the project but not in the file',
    value: UpdateTag.OBSOLETE
  }, {
    name: 'Overwritten translations',
    value: UpdateTag.OVERWRITTEN_TRANSLATIONS
  }]

  const response: UpdateTagObject = {
    [UpdateTag.ALL]: [],
    [UpdateTag.NEW]: [],
    [UpdateTag.OBSOLETE]: [],
    [UpdateTag.OVERWRITTEN_TRANSLATIONS]: []
  }

  log.info('You are about to add tags to your terms and translations. This action can be done multiple times')

  while (true) {
    const updateTags: UpdateTag[] = await selectCheckboxPlus('Select terms and translations states to apply tags to', buildChoiceSourceFunction<UpdateTag>(choices))

    if (!updateTags.length) {
      break
    }

    const tags = await inputTags()

    updateTags.forEach((state: UpdateTag) => {
      response[state].push(...tags)
    })
  }

  return response
}
