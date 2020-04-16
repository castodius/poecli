import * as inquirer from 'inquirer';
import { POEditor } from '@lib/poeditor';
import { AddProjectRequest } from '@models/poeditor';
import *  as log from '@lib/log';

export const add = async () => {
  const poe = new POEditor();

  const { name, description }: AddProjectRequest = await inquirer.prompt([
    {
      name: 'name',
      type: 'input',
      message: 'Input project name',
      validate: validateName
    },
    {
      name: 'description',
      type: 'input',
      message: 'Input project description (optional)',
    }
  ])

  const data = await poe.addProject({ name, description });
  log.info('Project successfully created');
  log.info(JSON.stringify(data));
}

export const validateName = (value: string): boolean | string => {
  if(!value.match(/.+/)){
    return 'Please input a project name consisting of at least one character'
  }

  return true;
};
