import { POEditor } from '@lib/poeditor'
import { AddContributorRequest } from '@models/poeditor'
import * as log from '@lib/log'
import { selectProject, selectProjectLanguage } from '@helpers/poeditor'
import { getConfirm } from '@helpers/prompt'
import inquirer from 'inquirer'

/**
 * Adds a contributor to a project
 */
export const add = async (): Promise<void> => {
  const poe = new POEditor()

  const project = await selectProject(poe)

  const { name, email }: {name: string, email: string} = await inquirer.prompt([
    {
      name: 'name',
      type: 'input',
      message: 'Please input contributor name'
    },
    {
      name: 'email',
      type: 'input',
      message: 'Please input contributor email'
    }
  ])

  const params: AddContributorRequest = {
    id: project.id,
    name,
    email
  }
  const admin = await getConfirm('Should the contributor be an admin for the project?')

  if (admin) {
    params.admin = 1
  } else {
    const language = await selectProjectLanguage(poe, project.id)
    if (!language) {
      log.info('The project has no languages, unable to add contributors')
      return
    }
    params.language = language.code
  }

  await poe.addContributor(params)
  log.info('Contributor added to project')
}
