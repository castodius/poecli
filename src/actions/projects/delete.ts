import { POEditor } from '@lib/poeditor'
import * as log from '@lib/log'
import { selectProject } from '@helpers/poeditor'
import { getConfirmation } from '@helpers/prompt'

/**
 * Deletes a project
 */
export const deleteProject = async (): Promise<void> => {
  const poe = new POEditor()

  const project = await selectProject(poe)

  const confirmation = await getConfirmation('Are you sure you want to delete this project? This action will only work if you are the owner of the project (which the CLI cannot verify).')

  if (!confirmation) {
    log.info('Aborting')
    return
  }

  await poe.deleteProject({ id: project.id })
  log.info('Project successfully deleted')
}
