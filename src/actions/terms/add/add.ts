import { POEditor } from '@lib/poeditor'
import * as log from '@lib/log'
import { selectProject } from '@helpers/poeditor'
import { addTerms } from '@helpers/terms'

/**
 * Adds terms to a project
 */
export const add = async (): Promise<void> => {
  const poe = new POEditor()

  const project = await selectProject(poe)
  if (!project) {
    log.info('You have no available projects')
    return
  }

  const data = await addTerms(poe, project)
  log.info('Terms added')
  log.info(JSON.stringify(data))
}
