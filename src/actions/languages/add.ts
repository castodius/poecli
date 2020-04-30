
import { POEditor } from '@lib/poeditor'
import * as log from '@lib/log'
import { selectLanguage, selectProject } from '@helpers/poeditor'

/**
 * Adds a language to a project
 */
export const add = async (): Promise<void> => {
  const poe = new POEditor()

  const project = await selectProject(poe)
  if (!project) {
    log.info('You have no available projects')
    return
  }
  const exclude = await poe.getProjectLanguages({ id: project.id })
  const language = await selectLanguage(poe, exclude)
  if (!language) {
    log.info('This project has no languages')
    return
  }

  await poe.addLanguage({ id: project.id, language: language.code })

  log.info(`Successfully added ${language.name} to ${project.name}`)
}
