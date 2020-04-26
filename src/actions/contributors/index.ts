import * as inquirer from 'inquirer'

import { entry as listEntry } from './list/index'

enum Action {
  LIST,
}

export const entry = async (): Promise<void> => {
  const { action } = await inquirer.prompt([
    {
      name: 'action',
      type: 'list',
      message: 'Select contributors action:',
      choices: [
        { name: 'List contributors', value: Action.LIST }
      ]
    }
  ])

  switch (action) {
    case Action.LIST: {
      await listEntry()
      break
    }
  }
}
