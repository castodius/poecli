import { POEditor } from '@lib/poeditor'
import * as log from '@lib/log'
import { selectProject, selectProjectLanguage } from '@helpers/poeditor'
import { ListTermsRequest } from '@models/poeditor'
import { getConfirm } from '@helpers/prompt'

/**
 * Lists terms
 */
export const list = async (): Promise<void> => {
  const poe = new POEditor()

  const project = await selectProject(poe)

  const languages = await poe.getProjectLanguages({ id: project.id })

  if (!languages) {
    await call(poe, { id: project.id })
    return
  }

  const confirmation = await getConfirm('Would you like to return terms for a language?')

  if (!confirmation) {
    await call(poe, { id: project.id })
    return
  }

  const language = await selectProjectLanguage(poe, project.id)

  await call(poe, { id: project.id, language: language ? language.code : undefined })
}

/**
 * Makes the call to POEditor listing terms
 * @param poe
 * POEditor instance
 * @param params
 * Params for which to list
 */
export const call = async (poe: POEditor, params: ListTermsRequest): Promise<void> => {
  const data = await poe.listTerms(params)
  log.info(JSON.stringify(data))
}
