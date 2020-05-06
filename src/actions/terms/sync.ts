import { POEditor } from '@lib/poeditor'
import * as log from '@lib/log'
import { selectProject } from '@helpers/poeditor'
import { TermBase } from '@models/poeditor'
import { inputTerms } from '@helpers/terms'

/**
 * Manually syncs in terms to a project. DANGEROUS. Should not be used for existing projects.
 */
export const sync = async () => {
  const poe = new POEditor()

  const project = await selectProject(poe)
  if (!project) {
    log.info('You have no available projects')
    return
  }

  const terms: TermBase[] = await inputTerms()

  const data = await poe.syncProject({ id: project.id, data: JSON.stringify(terms) })
  log.info('Project successfully synced')
  log.info(JSON.stringify(data))
}
