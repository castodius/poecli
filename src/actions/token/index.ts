import * as inquirer from 'inquirer'

import { getToken } from '@helpers/config'
import { get } from './get'
import { set } from './set'

enum Action {
  GET,
  SET,
}

export const entry = async (): Promise<void> => {
  const { action } = await inquirer.prompt([
    {
      name: 'action',
      type: 'list',
      message: 'Select token action:',
      choices: getChoices()
    }
  ])

  switch (action) {
    case Action.SET: {
      await set()
      break
    }
    case Action.GET: {
      await get()
      break
    }
  }
}

export const getChoices = () => {
  const choices = []
  if (getToken()) {
    choices.push({ name: 'Get', value: Action.GET })
  }
  choices.push({ name: 'Set', value: Action.SET })
  return choices
}
