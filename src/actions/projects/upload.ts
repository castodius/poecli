
import { POEditor } from '@lib/poeditor'
import * as log from '@lib/log'
import { selectProject, selectProjectLanguage, inputTags } from '@helpers/poeditor'
import inquirer from 'inquirer'
import { FileType, UpdateType, POBoolean, UpdateTag, UpdateTagObject } from '@models/poeditor'
import { readdirSync } from 'fs'

type POBooleanUndefined = POBoolean | undefined

export const upload = async (): Promise<void> => {
  const poe = new POEditor()

  const project = await selectProject(poe)

  const unfilteredFiles = readdirSync(process.cwd())

  const allowedFileFormats = Object.values(FileType)
  const files = unfilteredFiles.filter((filename: string) => {
    return allowedFileFormats.some((fileFormat: string) => {
      return filename.endsWith(`.${fileFormat}`)
    })
  })

  if (!files.length) {
    log.info('The directory you are currently located in does contain any valid files. Here is the list of allowed formats:')
    log.info(JSON.stringify(allowedFileFormats))
    return
  }

  const { updating, file }: { updating: UpdateType, file: string } = await inquirer.prompt([
    {
      name: 'updating',
      type: 'list',
      message: 'Select update type',
      choices: Object.values(UpdateType)
    },
    {
      name: 'file',
      type: 'list',
      message: 'Select a file',
      choices: files
    }
  ])

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
  log.info(JSON.stringify(data))
}

export const getLanguage = async (updating: UpdateType, id: number, poe: POEditor): Promise<string | undefined> => {
  if (updating === UpdateType.TERMS) {
    return
  }

  return (await selectProjectLanguage(poe, id))?.code
}

export const getOverwrite = async (updating: UpdateType): Promise<POBooleanUndefined> => {
  if (updating === UpdateType.TERMS) {
    return
  }

  const { overwrite }: { overwrite: boolean } = await inquirer.prompt([
    {
      name: 'overwrite',
      type: 'confirm',
      message: 'Do you want to overwrite existing translations in the project?'
    }
  ])

  return overwrite ? 1 : 0
}

export const getSyncTerms = async (updating: UpdateType): Promise<POBooleanUndefined> => {
  if (updating === UpdateType.TRANSLATIONS) {
    return
  }

  const { syncTerms }: { syncTerms: boolean } = await inquirer.prompt([
    {
      name: 'overwrite',
      type: 'confirm',
      message: 'Do you want to sync terms? Syncing terms will remove from the project which are not present in your file.'
    }
  ])

  return syncTerms ? 1 : 0
}

export const getReadFromSource = async (file: string): Promise<POBooleanUndefined> => {
  if (!file.endsWith(FileType.XLIFF)) {
    return
  }

  const { readFromSource }: { readFromSource: boolean } = await inquirer.prompt([
    {
      name: 'overwrite',
      type: 'confirm',
      message: 'Do you want to import translations from the source tag?'
    }
  ])

  return readFromSource ? 1 : 0
}

export const getFuzzyTrigger = async (): Promise<POBoolean> => {
  const { fuzzyTrigger }: { fuzzyTrigger: boolean } = await inquirer.prompt([
    {
      name: 'overwrite',
      type: 'confirm',
      message: 'Do you want to mark translations for other languages as fuzzy?'
    }
  ])

  return fuzzyTrigger ? 1 : 0
}

export const getTags = async (updating: UpdateType): Promise<UpdateTagObject | undefined> => {
  if (updating === UpdateType.TRANSLATIONS) {
    return
  }

  const choices = [{
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
    const { updateTags }: {updateTags: UpdateTag[]} = await inquirer.prompt([{
      name: 'updateTags',
      type: 'checkbox',
      message: 'Select term and translations states to apply tags to',
      choices
    }])

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
