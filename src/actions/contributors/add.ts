import { POEditor } from '@lib/poeditor'
import { AddContributorRequest } from '@models/poeditor'
import * as log from '@lib/log'
import { selectProject, selectProjectLanguage } from '@helpers/poeditor'
import { getConfirmation, promptInput } from '@helpers/prompt'

/**
 * Adds a contributor to a project
 */
export const add = async (): Promise<void> => {
  const poe = new POEditor()

  const project = await selectProject(poe)
  if (!project) {
    log.info('You have no available projects')
    return
  }

  const name: string = await promptInput('Please input contributor name')
  const email: string = await promptInput('Please input contributor email')

  const params: AddContributorRequest = {
    id: project.id,
    name,
    email
  }
  const admin = await getConfirmation('Should the contributor be an admin for the project?')

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
