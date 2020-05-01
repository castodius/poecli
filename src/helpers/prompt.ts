import * as inquirer from 'inquirer'
import * as autocomplete from 'inquirer-autocomplete-prompt'
import * as checkbox from 'inquirer-checkbox-plus-prompt'
inquirer.registerPrompt('autocomplete', autocomplete)
inquirer.registerPrompt('checkbox-plus', checkbox)

/**
 * Forces the user to confirm whether or not they want to do to something
 * @param message
 * Message to display to user. Should be a question.
 */
export const getConfirmation = async (message: string): Promise<boolean> => {
  const { confirm }: { confirm: boolean } = await inquirer.prompt([{
    name: 'confirm',
    type: 'confirm',
    message
  }])

  return confirm
}

export interface Choice<T> {
  name: string;
  value: T;
}

/**
 * Takes an array of T and returns a ready to use array of Choice for inquirer purposes
 * @param items
 * Items to be mapped
 * @param nameMapper
 * Function which can get a name from a T
 */
export const mapToChoices = <T>(items: T[], nameMapper: (item: T) => string): Choice<T>[] => {
  return items.map((item: T): Choice<T> => {
    return {
      name: nameMapper(item),
      value: item
    }
  })
}

/**
 * Generic choice selector
 * @param choices
 * A list of choices
 * @param message
 * Message to display
 */
// istanbul ignore next
export const selectX = async <T>(choices: Choice<T>[], message: string): Promise<T> => {
  const { choice }: { choice: T } = await inquirer.prompt([
    {
      name: 'choice',
      type: 'list',
      message,
      choices
    }
  ])

  return choice
}

/**
 * Generic autocomplete selector
 * @param message
 * Message to display
 * @param sourceFunction
 * Source function used when getting options
 */
export const selectAutoX = async<T>(message: string, sourceFunction: (_: string, input: string) => Promise<Choice<T>[]>) => {
  const { choice }: { choice: T } = await inquirer.prompt([
    {
      name: 'choice',
      type: 'autocomplete',
      message,
      source: sourceFunction
    }
  ])

  return choice
}
