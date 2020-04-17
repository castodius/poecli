import * as inquirer from 'inquirer';

import { available } from './available';
import { list } from './list';

enum Action {
  AVAILABLE,
  LIST
}

export const entry = async (): Promise<void> => {
  const { action } = await inquirer.prompt([
    {
      name: 'action',
      type: 'list',
      message: 'Select project action:',
      choices: [
        { name: 'List available languages', value: Action.AVAILABLE },
        { name: 'List project languages', value: Action.LIST },
      ]
    },
  ]);

  switch (action) {
    case Action.AVAILABLE: {
      await available();
      break;
    }
    case Action.LIST {
      await list();
      break;
    }
  }
};
