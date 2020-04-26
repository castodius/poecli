import * as inquirer from 'inquirer'

import { all } from './all'

enum Action {
  ALL,
}

export const entry = async (): Promise<void> => {
  const { action } = await inquirer.prompt([
    {
      name: 'action',
      type: 'list',
      message: 'Select list contributors action:',
      choices: [
        { name: 'List all contributors', value: Action.ALL }
      ]
    }
  ])

  switch (action) {
    case Action.ALL: {
      await all()
      break
    }
  }
}
