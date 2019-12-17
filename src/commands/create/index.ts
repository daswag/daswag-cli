import * as inquirer from 'inquirer';

import chalk from "chalk";
import {GeneratorBase} from '../../generator-base';
import Api = require('../../generators/services/api');
import Client = require('../../generators/services/client');
import UserMgmt = require("../../generators/services/user-mgmt");
import {ConstantsUtils} from "../../utils/constants-utils";

export class Create extends GeneratorBase {
  public static description = 'create a new service';

  public static args = [];

  public static flags = {};

  public loggerName() {
    return 'create';
  }

  public async run() {
    const {flags: options, args} = this.parse(Create);

    // Prompt question to choose which type of project user want to generate
    const answer: any = await inquirer.prompt([{
      choices: [
        {name: 'An Api', value: Api.GENERATOR_TYPE},
        {name: 'A Web Client', value: Client.GENERATOR_TYPE},
        {name: 'An User Management system for authentication', value: UserMgmt.GENERATOR_TYPE}],
      message: `Which ${chalk.yellow('*service*')} would you like to create?`,
      name: 'service',
      type: 'list'
    }]);

    // Validate all flags values
    this.validate(options);

    // Then launch the dedicated generator
    await super.generate('services', answer.service, {
      ...options,
    });
  }
}
