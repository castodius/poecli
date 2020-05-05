import * as inquirer from 'inquirer'

import { add } from './add'
import { simple } from './simple'

enum Action {
  ADD,
  SIMPLE
}

/**
 * Entry point for terms
 */
export const entry = async (): Promise<void> => {
  const { action } = await inquirer.prompt([
    {
      name: 'action',
      type: 'list',
      message: 'Select add term action:',
      choices: [
        { name: 'Add term', value: Action.ADD },
        { name: 'Add simplified term+translation', value: Action.SIMPLE }
      ]
    }
  ])

  switch (action) {
    case Action.ADD: {
      await add()
      break
    }
    case Action.SIMPLE: {
      await simple()
      break
    }
  }
}
