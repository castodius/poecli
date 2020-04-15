import * as commander from 'commander';

import { getToken } from '@helpers/config';
import { entry as tokenEntry} from '@actions/token/index';

const stuff2 = () => {
  console.log('stuff2!');
}

export const init = () => {
  //show text and stuff

  commander.on('command:*', () => {
    console.log(`Invalid command: ${commander.args.join(' ')}\nSee --help for a list of available commands.`);
  });
};

export const main = () => {
  init();

  commander
    .command('token')
    .description('Manage your POEditor token')
    .action(tokenEntry)

  if (getToken()) {
    commander
      .command('stuff2')
      .description('So stuff  2 ish!')
      .action(stuff2)
  }

  if (!commander.parse(process.argv).args.length) {
    commander.help();
  }
};

main();
