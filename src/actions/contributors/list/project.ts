import { POEditor } from '@lib/poeditor'
import { Contributor, ListContributorsRequest } from '@models/poeditor'
import * as log from '@lib/log'
import { selectProject, selectProjectLanguage } from '@helpers/poeditor'
import { getConfirmation } from '@helpers/prompt'

export const project = async (): Promise<void> => {
  const poe = new POEditor()

  const project = await selectProject(poe)

  const addLanguage = await getConfirmation('Get contributors for specific langauge?')

  const params: ListContributorsRequest = {
    id: project.id
  }

  if (addLanguage) {
    const language = await selectProjectLanguage(poe, project.id)
    if (!language) {
      log.info('The project has no languages')
    } else {
      params.language = language.code
    }
  }

  const contributors: Contributor[] = await poe.listContributors(params)
  log.info(JSON.stringify(contributors))
}
