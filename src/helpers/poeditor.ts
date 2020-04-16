import * as inquirer from 'inquirer';

import { POEditor } from "@lib/poeditor";
import { ListProjectsResult } from '@models/poeditor';

interface Choice {
  name: string;
  value: number;
}

interface Output {
  id: number;
}

export const selectProject = async (poe: POEditor): Promise<number> => {
  const projects = await poe.listProjects();

  const choices: Choice[] = mapProjectsToChoices(projects);
  const { id }: Output = await inquirer.prompt([
    {
      name: 'id',
      type: 'list',
      message: 'Select project:',
      choices
    }
  ])

  return id;
};

export const mapProjectsToChoices = (projects: ListProjectsResult[]): Choice[] =>{
  return projects.map(({name, id}: ListProjectsResult): Choice => {
    return {
      name: `${name} - ${id}`,
      value: id
    }
  });
};