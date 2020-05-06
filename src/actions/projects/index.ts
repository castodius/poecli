import * as inquirer from 'inquirer'

import { list } from './list'
import { view } from './view'
import { create } from './create'
import { update } from './update'
import { deleteProject } from './delete'
import { upload } from './upload'
import { exportProject } from './export'

enum Action {
  LIST,
  VIEW,
  CREATE,
  UPDATE,
  DELETE,
  UPLOAD,
  EXPORT
}

/**
 * Entry for projects
 */
export const entry = async (): Promise<void> => {
  const { action } = await inquirer.prompt([
    {
      name: 'action',
      type: 'list',
      message: 'Select project action:',
      choices: [
        { name: 'List', value: Action.LIST },
        { name: 'View', value: Action.VIEW },
        { name: 'Create', value: Action.CREATE },
        { name: 'Update', value: Action.UPDATE },
        { name: 'Delete', value: Action.DELETE },
        { name: 'Upload', value: Action.UPLOAD },
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
    case Action.CREATE: {
      await create()
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
    case Action.UPLOAD: {
      await upload()
      break
    }
    case Action.EXPORT: {
      await exportProject()
      break
    }
  }
}
