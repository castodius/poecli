import * as commander from 'commander'

import { getToken } from '@helpers/config'
import { entry as tokenEntry } from '@actions/token/index'
import { entry as projectsEntry } from '@actions/projects/index'
import { entry as languagesEntry } from '@actions/languages/index'
import { entry as termsEntry } from '@actions/terms/index'
import { entry as contributorsEntry } from '@actions/contributors/index'

export const init = () => {
  // show text and stuff

  commander.on('command:*', () => {
    console.log(`Invalid command: ${commander.args.join(' ')}\nSee --help for a list of available commands.`)
  })
}

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

main()
