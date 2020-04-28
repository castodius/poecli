import * as commander from 'commander'
import { textSync } from 'figlet'

import { getToken } from '@helpers/config'
import { entry as tokenEntry } from '@actions/token/index'
import { entry as projectsEntry } from '@actions/projects/index'
import { entry as languagesEntry } from '@actions/languages/index'
import { entry as termsEntry } from '@actions/terms/index'
import { entry as contributorsEntry } from '@actions/contributors/index'

/**
 * Sets up things other than commands
 */
export const init = () => {
  commander
    .description(textSync('POECLI') + '\nAn interactive POEditor CLI')

  commander.on('command:*', () => {
    console.log(`Invalid command: ${commander.args.join(' ')}\nSee --help for a list of available commands.`)
  })
}

/**
 * Adds services available to people with a token
 */
const addTokenServices = () => {
  commander
    .command('projects')
    .description('Manage projects')
    .action(projectsEntry)

  commander
    .command('languages')
    .description('Manage languages')
    .action(languagesEntry)

  commander
    .command('terms')
    .description('Manage terms')
    .action(termsEntry)

  commander
    .command('contributors')
    .description('Manage contributors')
    .action(contributorsEntry)
}

/**
 * Main, the entry point :)
 */
export const main = () => {
  init()

  if (getToken()) {
    addTokenServices()
  }

  commander
    .command('token')
    .description('Manage your POEditor token')
    .action(tokenEntry)

  if (!commander.parse(process.argv).args.length) {
    commander.help()
  }
}

// blast off!
main()
