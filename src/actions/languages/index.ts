import * as inquirer from 'inquirer'

import { available } from './available'
import { list } from './list'
import { add } from './add'
import { update } from './update'
import { deleteLanguage } from './delete'

enum Action {
  AVAILABLE,
  LIST,
  ADD,
  UPDATE,
  DELETE
}

/**
 * Entry point for languages
 */
export const entry = async (): Promise<void> => {
  const { action } = await inquirer.prompt([
    {
      name: 'action',
      type: 'list',
      message: 'Select project action:',
      choices: [
        { name: 'List available languages', value: Action.AVAILABLE },
        { name: 'List project languages', value: Action.LIST },
        { name: 'Add language to project', value: Action.ADD },
        { name: 'Update translations of project', value: Action.UPDATE },
        { name: 'Delete langauge from project', value: Action.DELETE }
      ]
    }
  ])

  switch (action) {
    case Action.AVAILABLE: {
      await available()
      break
    }
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
    case Action.DELETE: {
      await deleteLanguage()
      break
    }
  }
}
