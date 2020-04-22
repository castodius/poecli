import * as inquirer from 'inquirer'

import { list } from './list'
import { view } from './view'
import { add } from './add'
import { update } from './update'
import { deleteProject } from './delete'
import { sync } from './sync'
import { exportProject } from './export'

enum Action {
  LIST,
  VIEW,
  ADD,
  UPDATE,
  DELETE,
  SYNC,
  EXPORT
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
        { name: 'Delete', value: Action.DELETE },
        { name: 'Sync', value: Action.SYNC },
        { name: 'Export', value: Action.EXPORT }
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
    case Action.SYNC: {
      await sync()
      break
    }
    case Action.EXPORT: {
      await exportProject()
      break
    }
  }
}
