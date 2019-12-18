import chalk from "chalk";
import {GeneratorBase} from '../../generator-base';
import Api = require('../../generators/services/api');
import Client = require('../../generators/services/client');
import UserMgmt = require("../../generators/services/user-mgmt");
import * as inquirer from "inquirer";

export class Update extends GeneratorBase {
  public static description = 'create a new service';

  public static args = [];

  public static flags = {};

  public loggerName() {
    return 'update';
  }

  public async run() {
    const {flags: options, args} = this.parse(Update);

    if(this.isWorkspace()) {
      // Get workspace type
      const type = this.getWorkspaceType();
      if(type === Api.GENERATOR_TYPE || type === Client.GENERATOR_TYPE || type === UserMgmt.GENERATOR_TYPE) {
        this.log(`The ${chalk.red('update')} command will modify your current code to a new version of daSWAG. ${chalk.yellow('\n\nBe sure to commit everything to your repository in order to have the ability to rollback your update in case of error.')}`);
        const answer: any = await inquirer.prompt([{
          message: `Do you want to continue ?`,
          name: 'confirmUpdate',
          type: 'confirm'
        }]);
        if(answer && answer.confirmUpdate) {
          // Then launch the dedicated generator
          await super.generate('services', type, {
            ...options,
          });
        }
      } else {
        this.log(`${chalk.red('Update command cannot be applied to this directory. Be sure to execute it on a daSWAG service directory.')}`);
      }
    } else {
      this.log(`This command can only be called inside a daSWAG service folder.\n`);
    }
  }
}
