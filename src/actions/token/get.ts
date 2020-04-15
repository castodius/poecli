import { getToken } from '@helpers/config';
import *  as log from '@lib/log';

export const get = (): void => {
  const token: string = getToken();
  log.info(token);
}