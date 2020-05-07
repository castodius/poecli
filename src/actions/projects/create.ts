import { POEditor } from '@lib/poeditor'
import * as log from '@lib/log'
import { promptInput, getConfirmation, selectAuto, buildStringSourceFunction } from '@helpers/prompt'
import { Project } from '@models/poeditor'
import { addLanguagesToProject, setReferenceLanguage } from '@helpers/languages'
import { addTerms } from '@helpers/terms'
import { uploadProjectFile } from '@helpers/projects'

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
  await handleTerms(poe, data)
}

export const handleLanguages = async (poe: POEditor, project: Project) => {
  await addLanguagesToProject(poe, project)
  await setReferenceLanguage(poe, project)
}

export const handleTerms = async (poe: POEditor, project: Project) => {
  const confirmation = await getConfirmation('Would you like to add terms to the project?')
  if (!confirmation) {
    return
  }

  const method: string = await selectAuto('Would you like to enter terms manually or upload a file?', buildStringSourceFunction(['manually', 'file']))
  if (method === 'manually') {
    const data = await addTerms(poe, project)
    log.info('Terms added')
    log.info(JSON.stringify(data))
  } else {
    await uploadProjectFile(poe, project)
  }
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
