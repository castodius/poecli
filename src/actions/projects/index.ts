import * as inquirer from 'inquirer'

import { list } from './list'
import { view } from './view'
import { add } from './add'
import { update } from './update'
import { deleteProject } from './delete'

enum Action {
  LIST,
  VIEW,
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
        { name: 'List', value: Action.LIST },
        { name: 'View', value: Action.VIEW },
        { name: 'Add', value: Action.ADD },
        { name: 'Update', value: Action.UPDATE },
        { name: 'Delete', value: Action.DELETE }
      ]
    }
  ])

  switch (action) {
    case Action.LIST: {
      await list()
      break
    }
    case Action.VIEW: {
      await view()
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
      await deleteProject()
      break
    }
  }
}
