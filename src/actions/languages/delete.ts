
import { POEditor } from '@lib/poeditor'
import * as log from '@lib/log'
import { selectProject, selectProjectLanguage } from '@helpers/poeditor'

/**
 * Deletes a language from a project
 */
export const deleteLanguage = async (): Promise<void> => {
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

  await poe.deleteLanguage({ id: project.id, language: language.code })

  log.info(`Successfully removed ${language.name} from ${project.name}`)
}
