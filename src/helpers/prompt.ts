import inquirer from 'inquirer'

/**
 * Forces the user to confirm whether or not they want to do to something
 * @param message
 * Message to display to user. Should be a question.
 */
export const getConfirm = async (message: string): Promise<boolean> => {
  const { confirm }: { confirm: boolean } = await inquirer.prompt([{
    name: 'confirm',
    type: 'confirm',
    message
  }])

  return confirm
}
