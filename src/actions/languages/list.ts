import { POEditor } from '@lib/poeditor'
import * as log from '@lib/log'
import { selectProject } from '@helpers/poeditor'

/**
 * Lists languages for a project
 */
export const list = async (): Promise<void> => {
  const poe = new POEditor()

  const project = await selectProject(poe)

  const data = await poe.getProjectLanguages({ id: project.id })

  if (!data.length) {
    log.info('The selected project has no languages')
  } else {
    log.info(JSON.stringify(data))
  }
}
