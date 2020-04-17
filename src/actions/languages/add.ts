
import { POEditor } from '@lib/poeditor';
import *  as log from '@lib/log';
import { selectLanguage, selectProject } from '@helpers/poeditor';

export const add = async (): Promise<void> => {
  const poe = new POEditor();

  const project = await selectProject(poe);
  const exclude = await poe.getProjectLanguages({id: project.id});
  const language = await selectLanguage(poe, exclude);

  await poe.addLanguage({id: project.id, language: language.code});
  
  log.info(`Successfully added ${language.name} to ${project.name}`)
}