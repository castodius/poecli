import * as inquirer from 'inquirer'

import { list } from './list'
import { entry as addEntry } from './add/index'
import { update } from './update'
import { deleteTerms } from './delete'
import { comment } from './comment'

enum Action {
  LIST,
  ADD,
  UPDATE,
  DELETE,
  COMMENT
}

/**
 * Entry point for terms
 */
export const entry = async (): Promise<void> => {
  const { action } = await inquirer.prompt([
    {
      name: 'action',
      type: 'list',
      message: 'Select project action:',
      choices: [
        { name: 'List available terms for a project', value: Action.LIST },
        { name: 'Add term(s) to project', value: Action.ADD },
        { name: 'Update terms', value: Action.UPDATE },
        { name: 'Delete terms', value: Action.DELETE },
        { name: 'Add comments to terms', value: Action.COMMENT }
      ]
    }
  ])

  switch (action) {
    case Action.LIST: {
      await list()
      break
    }
    case Action.ADD: {
      await addEntry()
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
    case Action.COMMENT: {
      await comment()
      break
    }
  }
}
