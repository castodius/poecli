import { POEditor } from '@lib/poeditor'
import * as log from '@lib/log'
import { selectProject } from '@helpers/poeditor'

/**
 * Prints details about a project
 */
export const view = async (): Promise<void> => {
  const poe = new POEditor()

  const project = await selectProject(poe)
  if (!project) {
    log.info('You have no available projects')
    return
  }

  const data = await poe.viewProject({ id: project.id })
  log.info(JSON.stringify(data))
}
