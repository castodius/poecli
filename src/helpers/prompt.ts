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
export const selectAuto = async<T>(message: string, sourceFunction: (_: string, input: string) => Promise<Choice<T>[] | T[]>): Promise<T> => {
  return selectAdvanced<T, T>('autocomplete', message, sourceFunction)
}

/**
 * Generic checkbox-plus selector
 * @param message
 * Message to display
 * @param sourceFunction
 * Source function used when getting options
 */
export const selectCheckboxPlus = async<T>(message: string, sourceFunction: (_: string, input: string) => Promise<Choice<T>[] | T[]>): Promise<T[]> => {
  return selectAdvanced<T, T[]>('checkbox-plus', message, sourceFunction)
}

/**
 * Generic function for advanced prompt functions
 * @param type
 * Inquirer prompt type. Autocomplete, checkbox-plus etc
 * @param message
 * Message to display
 * @param sourceFunction
 * Source function used when getting options
 */
export const selectAdvanced = async<T, U>(type: string, message: string, sourceFunction: (_: string, input: string) => Promise<Choice<T>[] | T[]>): Promise<U> => {
  const { choice }: { choice: U } = await inquirer.prompt([
    {
      name: 'choice',
      type,
      message,
      source: sourceFunction
    }
  ])

  return choice
}

/**
 * Prompts the user for input
 * @param message
 * Message to display
 */
export const promptInput = async (message: string, defaultValue: string = '', validate?: (value: string) => boolean | string): Promise<string> => {
  const { choice }: { choice: string } = await inquirer.prompt([
    {
      name: 'choice',
      type: 'input',
      message,
      default: defaultValue,
      validate
    }
  ])

  return choice
}

/**
 * Builds a source function for inquirer for an array of strings
 * @param choices
 * Array of strings
 */
export const buildStringSourceFunction = (choices: string[]): (_: string, input: string) => Promise<string[]> => {
  return async (_: string, input: string): Promise<string[]> => {
    if (!input) {
      return choices
    }
    return choices.filter((choice: string): boolean => {
      return choice.includes(input)
    })
  }
}

/**
 * Generic source function builder for Choice<T>
 * @param choices
 * Array of Choice<T>
 */
export const buildChoiceSourceFunction = <T>(choices: Choice<T>[]): (_: string, input: string) => Promise<Choice<T>[]> => {
  return async (_: string, input: string): Promise<Choice<T>[]> => {
    if (!input) {
      return choices
    }
    return choices.filter((choice: Choice<T>): boolean => {
      return choice.name.includes(input)
    })
  }
}
