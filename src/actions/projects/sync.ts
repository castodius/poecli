import { POEditor } from '@lib/poeditor'
import * as log from '@lib/log'
import { selectProject, inputTerms } from '@helpers/poeditor'
import { TermBase } from '@models/poeditor'

export const sync = async () => {
  const poe = new POEditor()

  const project = await selectProject(poe)

  const terms: TermBase[] = await inputTerms()

  console.log(terms)
  const data = await poe.syncProject({ id: project.id, data: JSON.stringify(terms) })
  log.info('Project successfully synced')
  log.info(JSON.stringify(data))
}
