
import { POEditor } from '@lib/poeditor'
import * as log from '@lib/log'
import { selectProject } from '@helpers/poeditor'
import { addLanguagesToProject } from '@helpers/languages'

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

  await addLanguagesToProject(poe, project, exclude)
}
