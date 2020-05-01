import * as inquirer from 'inquirer'
import { POEditor } from '@lib/poeditor'
import * as log from '@lib/log'
import { selectProject, selectProjectLanguage, inputTags, exportFiltersSource } from '@helpers/poeditor'
import { FileType, ExportFilter } from '@models/poeditor'
import { getConfirmation, selectCheckboxPlus } from '@helpers/prompt'

/**
 * Exports project data
 */
export const exportProject = async (): Promise<void> => {
  const poe = new POEditor()

  const project = await selectProject(poe)
  if (!project) {
    log.info('You have no available projects')
    return
  }
  const language = await selectProjectLanguage(poe, project.id)

  if (!language) {
    log.info('The selected project has no languages')
    return
  }

  const { type }: {type: FileType} = await inquirer.prompt([
    {
      name: 'type',
      type: 'list',
      message: 'Select output format',
      choices: Object.values(FileType)
    }
  ])
  const filters: string[] = await selectCheckboxPlus<string>('Select filters (optional', exportFiltersSource)

  const tags: string[] = await inputTags()

  const order = await getConfirmation('Order alphabetically by terms?')

  const url = await poe.exportProject({
    id: project.id,
    language: language.code,
    type,
    filters: filters as ExportFilter[], // hard to get this right without casting
    tags,
    order: order ? 'terms' : ''
  })
  log.info('File export url successfully generated. Download your file from the url within the next 10 minutes')
  log.info(url)
}

/**
 * Validates tags
 * @param value
 * Value to validate
 */
export const validateTags = (value: string): string | boolean => {
  if (!value) {
    return true
  }

  if (!value.match(/^([^,\s]+,)*[^,\s]+$/)) {
    return 'Input should be a comma separated list. For example "abc,def"'
  }

  return true
}
