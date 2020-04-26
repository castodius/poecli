import { POEditor } from '@lib/poeditor'
import { Contributor } from '@models/poeditor'
import * as log from '@lib/log'

/**
 * Lists all contributors
 */
export const all = async (): Promise<void> => {
  const poe = new POEditor()

  const contributors: Contributor[] = await poe.listContributors({})

  log.info(JSON.stringify(contributors))
}
