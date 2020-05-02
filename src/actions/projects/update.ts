import { POEditor } from '@lib/poeditor'
import * as log from '@lib/log'
import { selectProject } from '@helpers/poeditor'
import { promptInput } from '@helpers/prompt'

/**
 * Updates project information
 */
export const update = async () => {
  const poe = new POEditor()

  const project = await selectProject(poe)
  if (!project) {
    log.info('You have no available projects')
    return
  }
  const completeProject = await poe.viewProject({ id: project.id })

  const name: string = await promptInput('Input new project name (optional)', completeProject.name)
  const description: string = await promptInput('Input new project name (optional)', completeProject.name)
  const referenceLanguage: string = await promptInput('Input new project name (optional)', completeProject.name)

  const data = await poe.updateProject({ id: project.id, name, description, reference_language: referenceLanguage })
  log.info('Project successfully updated')
  log.info(JSON.stringify(data))
}
