import inquirer from 'inquirer'

export const getConfirm = async (message: string): Promise<boolean> => {
  const { confirm }: { confirm: boolean } = await inquirer.prompt([{
    name: 'confirm',
    type: 'confirm',
    message
  }])

  return confirm
}
