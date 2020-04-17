import * as inquirer from 'inquirer';

import { available } from './available';

enum Action {
  AVAILABLE,
}

export const entry = async (): Promise<void> => {
  const { action } = await inquirer.prompt([
    {
      name: 'action',
      type: 'list',
      message: 'Select project action:',
      choices: [
        { name: 'List available languages', value: Action.AVAILABLE },
      ]
    },
  ]);

  switch (action) {
    case Action.AVAILABLE: {
      await available();
      break;
    }
  }
};
