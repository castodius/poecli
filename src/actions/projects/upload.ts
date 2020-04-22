
import { POEditor } from '@lib/poeditor'
import * as log from '@lib/log'
import { selectProject, selectProjectLanguage } from '@helpers/poeditor'
import inquirer from 'inquirer'
import { FileType, UpdateType } from '@models/poeditor'
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

  const data = await poe.uploadProject({
    id: project.id,
    updating,
    file: `${process.cwd()}/${file}`,
    language
  })
  log.info(JSON.stringify(data))
}

export const getLanguage = async (updating: UpdateType, id: number, poe: POEditor): Promise<string|undefined> => {
  if (updating === UpdateType.TERMS) {
    return
  }

  return (await selectProjectLanguage(poe, id))?.code
}
