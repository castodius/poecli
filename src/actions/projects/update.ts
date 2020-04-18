import * as inquirer from 'inquirer'
import { POEditor } from '@lib/poeditor'
import * as log from '@lib/log'
import { selectProject } from '@helpers/poeditor'

interface PromptResult {
  name: string;
  description: string;
  // eslint-disable-next-line camelcase
  reference_language: string;
}

export const update = async () => {
  const poe = new POEditor()

  const project = await selectProject(poe)
  const completeProject = await poe.viewProject({ id: project.id })

  const result: PromptResult = await inquirer.prompt([
    {
      name: 'name',
      type: 'input',
      message: 'Input new project name (optional)',
      default: completeProject.name
    },
    {
      name: 'description',
      type: 'input',
      message: 'Input new project description (optional)',
      default: completeProject.description
    },
    {
      name: 'reference_language',
      type: 'input',
      message: 'Input new reference language (optional)',
      default: completeProject.reference_language || ''
    }
  ])

  const data = await poe.updateProject({ id: project.id, ...result })
  log.info('Project successfully updated')
  log.info(JSON.stringify(data))
}
