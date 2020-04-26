import { POEditor } from '@lib/poeditor'
import * as log from '@lib/log'
import { Language } from '@models/poeditor'

/**
 * Returns a list of available languages
 */
export const available = async (): Promise<void> => {
  const poe = new POEditor()

  const languages: Language[] = await poe.getAvailableLanguages()

  log.info(JSON.stringify(languages))
}
