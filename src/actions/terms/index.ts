import * as inquirer from 'inquirer'

import { list } from './list'
import { add } from './add'
import { update } from './update'
import { deleteTerms } from './delete'

enum Action {
  LIST,
  ADD,
  UPDATE,
  DELETE
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
        { name: 'Update terms', value: Action.UPDATE },
        { name: 'Delete terms', value: Action.DELETE }
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
    case Action.DELETE: {
      await deleteTerms()
      break
    }
  }
}
