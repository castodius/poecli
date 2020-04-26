import { POEditor } from '@lib/poeditor'
import * as log from '@lib/log'
import { selectProject, inputTerms } from '@helpers/poeditor'
import { TermBase } from '@models/poeditor'

/**
 * Adds terms to a project
 */
export const add = async (): Promise<void> => {
  const poe = new POEditor()

  const project = await selectProject(poe)

  const terms: TermBase[] = await inputTerms()

  const data = await poe.addTerms({ id: project.id, terms })
  log.info('Terms added')
  log.info(JSON.stringify(data))
}
