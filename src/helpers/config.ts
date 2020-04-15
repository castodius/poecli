import { getValueAsString, write } from '@helpers/storage';

//models
import { StorageNames } from '@models/storage';

export const getToken = (): string => {
  return getValueAsString(StorageNames.TOKEN);
};

export const setToken = (token: string): void => {
  write(StorageNames.TOKEN, token);
};