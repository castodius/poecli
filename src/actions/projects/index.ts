import * as inquirer from 'inquirer';

import { list } from './list';
import { view } from './view';

enum Action {
  LIST,
  VIEW,
}

export const entry = async (): Promise<void> => {
  const { action } = await inquirer.prompt([
    {
      name: 'action',
      type: 'list',
      message: 'Select project action:',
      choices: [
        {name: 'List', value: Action.LIST},
        {name: 'View', value: Action.VIEW}
      ]
    },
  ]);

  switch (action) {
    case Action.LIST: {
      await list();
      break;
    }
    case Action.VIEW: {
      await view();
      break;
    }
  }
};
