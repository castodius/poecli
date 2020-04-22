
import { POEditor } from '@lib/poeditor'
import * as log from '@lib/log'
import { selectProject, selectProjectLanguage } from '@helpers/poeditor'
import inquirer from 'inquirer'
import { FileType, UpdateType, POBoolean } from '@models/poeditor'
import { readdirSync } from 'fs'

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
  const overwrite: POBoolean | undefined = await getOverwrite(updating)
  const syncTerms: POBoolean | undefined = await getSyncTerms(updating)

  const data = await poe.uploadProject({
    id: project.id,
    updating,
    file: `${process.cwd()}/${file}`,
    language,
    overwrite,
    sync_terms: syncTerms
  })
  log.info(JSON.stringify(data))
}

export const getLanguage = async (updating: UpdateType, id: number, poe: POEditor): Promise<string | undefined> => {
  if (updating === UpdateType.TERMS) {
    return
  }

  return (await selectProjectLanguage(poe, id))?.code
}

export const getOverwrite = async (updating: UpdateType): Promise<POBoolean | undefined> => {
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

export const getSyncTerms = async (updating: UpdateType): Promise<POBoolean | undefined> => {
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
