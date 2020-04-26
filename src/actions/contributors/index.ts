import * as inquirer from 'inquirer'

import { entry as listEntry } from './list/index'
import { add } from './add'
import { remove } from './remove'

enum Action {
  LIST,
  ADD,
  REMOVE
}

/**
 * Entry point for contributors
 */
export const entry = async (): Promise<void> => {
  const { action } = await inquirer.prompt([
    {
      name: 'action',
      type: 'list',
      message: 'Select contributors action:',
      choices: [
        { name: 'List contributors', value: Action.LIST },
        { name: 'Add contributor to project', value: Action.ADD },
        { name: 'Remove contributor from project/language', value: Action.REMOVE }
      ]
    }
  ])

  switch (action) {
    case Action.LIST: {
      await listEntry()
      break
    }
    case Action.ADD: {
      await add()
      break
    }
    case Action.REMOVE: {
      await remove()
      break
    }
  }
}
