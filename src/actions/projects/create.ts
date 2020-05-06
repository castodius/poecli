import { POEditor } from '@lib/poeditor'
import * as log from '@lib/log'
import { promptInput } from '@helpers/prompt'
import { Project } from '@models/poeditor'
import { addLanguagesToProject, setReferenceLanguage } from '@helpers/languages'

/**
 * Creates a new project
 */
export const create = async (): Promise<void> => {
  const poe = new POEditor()

  const name: string = await promptInput('Input project name', '', validateName)
  const description: string = await promptInput('Input project description (optional)')

  const data = await poe.addProject({ name, description })
  log.info('Project successfully created')
  log.info(JSON.stringify(data))

  await handleLanguages(poe, data)
}

export const handleLanguages = async (poe: POEditor, project: Project) => {
  await addLanguagesToProject(poe, project)
  await setReferenceLanguage(poe, project)
}

/**
 * Validates a project name
 * @param value
 * Value to validate
 */
export const validateName = (value: string): boolean | string => {
  if (!value.match(/.+/)) {
    return 'Please input a project name consisting of at least one character'
  }

  return true
}
