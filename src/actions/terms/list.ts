import { POEditor } from '@lib/poeditor'
import * as log from '@lib/log'
import { selectProject, selectProjectLanguage } from '@helpers/poeditor'
import inquirer from 'inquirer'
import { ListTermsRequest } from '@models/poeditor'

export const list = async (): Promise<void> => {
  const poe = new POEditor()

  const project = await selectProject(poe)

  const languages = await poe.getProjectLanguages({ id: project.id })

  if (!languages) {
    await call(poe, { id: project.id })
    return
  }

  const { confirmation } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmation',
      message: 'Would you like to return terms for a language?'
    }
  ])

  if (!confirmation) {
    await call(poe, { id: project.id })
    return
  }

  const language = await selectProjectLanguage(poe, project.id)

  await call(poe, { id: project.id, language: language ? language.code : undefined })
}

export const call = async (poe: POEditor, params: ListTermsRequest): Promise<void> => {
  const data = await poe.listTerms(params)
  log.info(JSON.stringify(data))
}
