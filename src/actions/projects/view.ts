import { POEditor } from '@lib/poeditor'
import * as log from '@lib/log'
import { selectProject } from '@helpers/poeditor'

/**
 * Prints details about a project
 */
export const view = async (): Promise<void> => {
  const poe = new POEditor()

  const id: number = (await selectProject(poe)).id

  const data = await poe.viewProject({ id })
  log.info(JSON.stringify(data))
}
