import * as commander from 'commander';

import { getToken } from '@helpers/config';
import { entry as tokenEntry } from '@actions/token/index';
import { entry as projectsEntry } from '@actions/projects/index';

export const init = () => {
  //show text and stuff

  commander.on('command:*', () => {
    console.log(`Invalid command: ${commander.args.join(' ')}\nSee --help for a list of available commands.`);
  });
};

const addTokenServices = () => {
  commander
    .command('projects')
    .description('Manage projects')
    .action(projectsEntry)
}

export const main = () => {
  init();

  if (getToken()) {
    addTokenServices();
  }
  
  commander
    .command('token')
    .description('Manage your POEditor token')
    .action(tokenEntry)


  if (!commander.parse(process.argv).args.length) {
    commander.help();
  }
};

main();