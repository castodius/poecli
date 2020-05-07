
import { POEditor } from '@lib/poeditor'
import * as log from '@lib/log'
import { selectProject } from '@helpers/poeditor'
import { uploadProjectFile } from '@helpers/projects'

/**
 * Uploads a file to POEditor which will add terms to a project
 */
export const upload = async (): Promise<void> => {
  const poe = new POEditor()

  const project = await selectProject(poe)
  if (!project) {
    log.info('You have no available projects')
    return
  }

  await uploadProjectFile(poe, project)
}
