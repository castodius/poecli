import * as inquirer from 'inquirer'

import { all } from './all'
import { project } from './project'

enum Action {
  ALL,
  PROJECT
}

/**
 * Entry point for listing contributors
 */
export const entry = async (): Promise<void> => {
  const { action } = await inquirer.prompt([
    {
      name: 'action',
      type: 'list',
      message: 'Select list contributors action:',
      choices: [
        { name: 'List all contributors', value: Action.ALL },
        { name: 'List contributors for a project', value: Action.PROJECT }
      ]
    }
  ])

  switch (action) {
    case Action.ALL: {
      await all()
      break
    }
    case Action.PROJECT: {
      await project()
      break
    }
  }
}
