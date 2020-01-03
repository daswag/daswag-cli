import chalk from "chalk";
import * as inquirer from "inquirer";
import {GeneratorBase} from '../../generator-base';
import Api = require('../../generators/services/api');
import Client = require('../../generators/services/client');
import UserMgmt = require("../../generators/services/user-mgmt");
import {ConstantsUtils} from "../../utils/constants-utils";

export class Update extends GeneratorBase {
  public static description = 'Update your service version';

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
          message: `Do you want to continue?`,
          name: 'confirmUpdate',
          type: 'confirm'
        }]);
        if(answer && answer.confirmUpdate) {
          const itemChoices: any[] = [
            {name: `Core content`, value: 'service'},
          ];
          if(type === Api.GENERATOR_TYPE) {
            itemChoices.push({name: 'Entity component', value: 'api-entity'});
            itemChoices.push({name: 'Resource component', value: 'api-resource'});
            itemChoices.push({name: 'Method component', value: 'api-method'});
          }
          const answerItems: any = await inquirer.prompt([{
            choices: itemChoices,
            message: `Which part of your service do you want to update?`,
            name: 'updateItems',
            type: 'checkbox'
          }]);

          // Then launch the dedicated generator
          if(answerItems && answerItems.updateItems) {
            // If Core content has been chosen
            if(answerItems.updateItems.indexOf('service') !== -1) {
              await super.generate('services', type, {
                ...options,
              });
            }
            for (const item of answerItems.updateItems) {
              if(item !== 'service') {
                await super.generate('components', item, {
                  ...options,
                  action: ConstantsUtils.ACTION_UPDATE
                });
              }
            }
          }
        }
      } else {
        this.log(`${chalk.red('Update command cannot be applied to this directory. Be sure to execute it on a daSWAG service directory.')}`);
      }
    } else {
      this.log(`This command can only be called inside a daSWAG service folder.\n`);
    }
  }
}
