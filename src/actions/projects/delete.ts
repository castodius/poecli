import * as inquirer from 'inquirer'
import { POEditor } from '@lib/poeditor'
import * as log from '@lib/log'
import { selectProject } from '@helpers/poeditor'

interface PromptResult {
  confirmation: boolean;
}

export const deleteProject = async (): Promise<void> => {
  const poe = new POEditor()

  const project = await selectProject(poe)

  const { confirmation }: PromptResult = await inquirer.prompt([
    {
      name: 'confirmation',
      type: 'list',
      message: 'Are you sure you want to delete this project? This action will only work if you are the owner of the project (which the CLI cannot verify).',
      choices: [{
        name: 'no',
        value: false
      }, {
        name: 'yes',
        value: true
      }]
    }
  ])

  if (!confirmation) {
    log.info('Aborting')
    return
  }

  await poe.deleteProject({ id: project.id })
  log.info('Project successfully deleted')
}
