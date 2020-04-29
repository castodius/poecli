import { prompt } from 'inquirer'

/**
 * Forces the user to confirm whether or not they want to do to something
 * @param message
 * Message to display to user. Should be a question.
 */
export const getConfirmation = async (message: string): Promise<boolean> => {
  const { confirm }: { confirm: boolean } = await prompt([{
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
