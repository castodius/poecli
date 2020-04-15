import { writeFileSync, readFileSync, existsSync } from 'fs';
import { homedir } from 'os';

import { variables } from '@helpers/env';

const storageFile = `${homedir()}/${variables.storageFile}`;

type StorageObject = Record<string, string | number>;

export const getStorageObject = (): StorageObject => {
  if (!existsSync(storageFile)) {
    return {}
  }

  const data = readFileSync(storageFile);
  return JSON.parse(data.toString());
};

export const putStorageObjct = (storageObject: StorageObject) =>{
  writeFileSync(storageFile, JSON.stringify(storageObject));
}

export const write = (key: string, value: string | number) => {
  const storageObject: StorageObject = getStorageObject();
  storageObject[key] = value;
  putStorageObjct(storageObject)
};

export const increment = (key: string, defaultValue: number = 0) => {
  const storageObject: StorageObject = getStorageObject();
  storageObject[key] = Number(storageObject[key] || defaultValue) + 1;
  putStorageObjct(storageObject)
};

export const clear = (key: string) => {
  const storageObject: StorageObject = getStorageObject();
  delete storageObject[key];
  putStorageObjct(storageObject)
}

export const getValueAsString = (key: string): string => {
  const storageObject: StorageObject = getStorageObject();
  if(!storageObject[key]){
    return '';
  }
  return storageObject[key].toString();
};

export const getValueAsNumber = (key: string): number => {
  const storageObject: StorageObject = getStorageObject();
  if(!storageObject[key]){
    return 0;
  }
  return Number(storageObject[key]);
};