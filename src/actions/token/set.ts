import { setToken } from '@helpers/config';
import inquirer from 'inquirer';
import { POEditor } from '@lib/poeditor'
import * as log from '@lib/log';


export const set = async (): Promise<void> => {
  const token = await getToken();

  setToken(token);
  log.info('Token verified and stored');
};

export const getToken = async (): Promise<string> => {
  while (true) {
    const { token } = await prompt();

    if (await verifyToken(token)) {
      return token;
    }
  }
};

export const verifyToken = async (token: string): Promise<boolean> => {
  const poe = new POEditor(token);

  try {
    await poe.listProjects();
    return true;
  } catch (err) {
    log.info('Token verifiation failed. Message from POEditor: ' + err.message);
    return false;
  }
};

export const prompt = async () => {
  return await inquirer.prompt([{
    name: 'token',
    type: 'input',
    message: 'Input your POEditor token:',
    validate
  }])
};

export const validate = (value: string): boolean | string => {
  if (!value.match(/^[0-9a-f]+$/)) {
    return 'Please input a token consisting of numbers and the letters a through f';
  }

  if (value.length !== 32) {
    return 'Please input a token of length 32 (POEditor standard)';
  }

  return true;
};
