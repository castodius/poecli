import * as inquirer from 'inquirer';

import { POEditor } from "@lib/poeditor";
import { CompactProject } from '@models/poeditor';

interface Choice {
  name: string;
  value: CompactProject;
}

interface Output {
  project: CompactProject;
}

export const selectProject = async (poe: POEditor): Promise<CompactProject> => {
  const projects = await poe.listProjects();

  const choices: Choice[] = mapProjectsToChoices(projects);
  const { project }: Output = await inquirer.prompt([
    {
      name: 'project',
      type: 'list',
      message: 'Select project:',
      choices
    }
  ])

  return project;
};

export const mapProjectsToChoices = (projects: CompactProject[]): Choice[] => {
  return projects.map((project: CompactProject): Choice => {
    return {
      name: `${project.name} - ${project.id}`,
      value: project
    }
  });
};