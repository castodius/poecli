import * as inquirer from 'inquirer'

import { list } from './list'
import { add } from './add'
import { update } from './update'

enum Action {
  LIST,
  ADD,
  UPDATE
}

export const entry = async (): Promise<void> => {
  const { action } = await inquirer.prompt([
    {
      name: 'action',
      type: 'list',
      message: 'Select project action:',
      choices: [
        { name: 'List available terms for a project', value: Action.LIST },
        { name: 'Add terms to project', value: Action.ADD },
        { name: 'Update terms', value: Action.UPDATE }
      ]
    }
  ])

  switch (action) {
    case Action.LIST: {
      await list()
      break
    }
    case Action.ADD: {
      await add()
      break
    }
    case Action.UPDATE: {
      await update()
      break
    }
  }
}
