import { POEditor } from '@lib/poeditor'
import * as log from '@lib/log'

export const list = async (): Promise<void> => {
  const poe = new POEditor()

  const data = await poe.listProjects()
  log.info(JSON.stringify(data))
}
