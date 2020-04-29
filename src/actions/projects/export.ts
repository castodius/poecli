import * as inquirer from 'inquirer'
import * as checkbox from 'inquirer-checkbox-plus-prompt'
import { POEditor } from '@lib/poeditor'
import * as log from '@lib/log'
import { selectProject, selectProjectLanguage, inputTags } from '@helpers/poeditor'
import { FileType, ExportFilter } from '@models/poeditor'
import { getConfirm } from '@helpers/prompt'

inquirer.registerPrompt('checkbox-plus', checkbox)

const filters = Object.values(ExportFilter)

/**
 * Exports project data
 */
export const exportProject = async (): Promise<void> => {
  const poe = new POEditor()

  const project = await selectProject(poe)
  const language = await selectProjectLanguage(poe, project.id)

  if (!language) {
    log.info('The selected project has no languages')
    return
  }

  const { type, filters }: {type: FileType, filters: ExportFilter[]} = await inquirer.prompt([
    {
      name: 'type',
      type: 'list',
      message: 'Select output format',
      choices: Object.values(FileType)
    },
    {
      name: 'filters',
      type: 'checkbox-plus',
      message: 'Select filters (optional)',
      searchable: true,
      source: filterSource
    }
  ])

  const tags: string[] = await inputTags()

  const order = await getConfirm('Order alphabetically by terms?')

  const url = await poe.exportProject({
    id: project.id,
    language: language.code,
    type,
    filters,
    tags,
    order: order ? 'terms' : ''
  })
  log.info('File export url successfully generated. Download your file from the url within the next 10 minutes')
  log.info(url)
}

/**
 * Filter function for inquirer
 * @param _
 * Irrelevant
 * @param input
 * Input to filter
 */
export const filterSource = async (_: Record<string, string>, input: string): Promise<string[]> => {
  if (!input) {
    return filters
  }
  return filters.filter((value: string) => {
    return value.includes(input)
  })
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
