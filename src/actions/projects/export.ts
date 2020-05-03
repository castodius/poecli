import { POEditor } from '@lib/poeditor'
import * as log from '@lib/log'
import { selectProject, selectProjectLanguage, inputTags } from '@helpers/poeditor'
import { FileType, ExportFilter } from '@models/poeditor'
import { getConfirmation, selectCheckboxPlus, selectAuto, buildStringSourceFunction } from '@helpers/prompt'

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

  const type: string = await selectAuto('Select output format', buildStringSourceFunction(Object.values(FileType)))
  const filters: string[] = await selectCheckboxPlus<string>('Select filters (optional)', buildStringSourceFunction(Object.values(ExportFilter)))

  const tags: string[] = await inputTags()

  const order = await getConfirmation('Order alphabetically by terms?')

  const url = await poe.exportProject({
    id: project.id,
    language: language.code,
    type: type as FileType,
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
