import * as inquirer from 'inquirer'

import { list } from './list'

enum Action {
  LIST,
}

export const entry = async (): Promise<void> => {
  const { action } = await inquirer.prompt([
    {
      name: 'action',
      type: 'list',
      message: 'Select project action:',
      choices: [
        { name: 'List available terms for a project', value: Action.LIST }
      ]
    }
  ])

  switch (action) {
    case Action.LIST: {
      await list()
      break
    }
  }
}
