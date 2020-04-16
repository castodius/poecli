import { POEditor } from '@lib/poeditor';
import *  as log from '@lib/log';
import { selectProject } from '@helpers/poeditor';

export const view = async (): Promise<void> => {
  const poe = new POEditor();

  const id: number = await selectProject(poe)

  const data = await poe.viewProject({id});
  log.info(JSON.stringify(data));
}