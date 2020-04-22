import * as inquirer from 'inquirer'
import * as checkbox from 'inquirer-checkbox-plus-prompt'
import { POEditor } from '@lib/poeditor'
import * as log from '@lib/log'
import { selectProject, selectProjectLanguage } from '@helpers/poeditor'
import { FileType, ExportFilter } from '@models/poeditor'

inquirer.registerPrompt('checkbox-plus', checkbox)

interface PromptResult {
  type: FileType;
  filters: ExportFilter[];
  tags?: string;
  order: boolean
}

const filters = Object.values(ExportFilter)

export const exportProject = async (): Promise<void> => {
  const poe = new POEditor()

  const project = await selectProject(poe)
  const language = await selectProjectLanguage(poe, project.id)

  if (!language) {
    log.info('The selected project has no languages')
    return
  }

  const { type, filters, tags, order }: PromptResult = await inquirer.prompt([
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
    },
    {
      name: 'tags',
      type: 'input',
      message: 'Input tags to filter on (optional)',
      validate: validateTags
    },
    {
      name: 'order',
      type: 'confirm',
      message: 'Order alphabetically by terms?'
    }
  ])

  const url = await poe.exportProject({
    id: project.id,
    language: language.code,
    type,
    filters,
    tags: tags ? tags.split(',') : [],
    order: order ? 'terms' : ''
  })
  log.info('File export url successfully generated. Download your file from the url within the next 10 minutes')
  log.info(url)
}

export const filterSource = async (_: Record<string, string>, input: string): Promise<string[]> => {
  if (!input) {
    return filters
  }
  return filters.filter((value: string) => {
    return value.includes(input)
  })
}

export const validateTags = (value: string): string | boolean => {
  if (!value) {
    return true
  }

  if (!value.match(/^([^,\s]+,)*[^,\s]+$/)) {
    return 'Input should be a comma separated list. For example "abc,def"'
  }

  return true
}
