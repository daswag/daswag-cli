import * as inquirer from 'inquirer';

import chalk from "chalk";
import {GeneratorBase} from '../../generator-base';
import ApiEntity = require("../../generators/components/api-entity");
import ApiMethod = require("../../generators/components/api-method");
import ApiResource = require("../../generators/components/api-resource");
import Api = require("../../generators/services/api");

export class Add extends GeneratorBase {
  public static description = 'generate a new component';

  public static args = [];

  public static flags = {};

  public loggerName() {
    return 'add';
  }

  public async run() {
    const {flags: options, args} = this.parse(Add);

    // Check if we are on a project folder (.yo-rc.json exists and type is app)
    const serviceType = this.getWorkspaceType();
    let choicesByType : any = []
    // Prompt question to choose which component we need to generate
    if(serviceType === Api.GENERATOR_TYPE) {
      choicesByType = [
        {name: 'Entity', value: ApiEntity.GENERATOR_TYPE},
        {name: 'Resource', value: ApiResource.GENERATOR_TYPE},
        {name: 'Method', value: ApiMethod.GENERATOR_TYPE},
      ]
    }

    if(choicesByType.length === 0) {
      // No component to generate there
      this.log('There is no component generation for that kind of service yet. If you need some, feel free too pen an issue on https://github.com/daswag/daswag-cli')
      this.exit(0);
    }

    const answer: any = await inquirer.prompt([{
      choices: choicesByType,
      message: `Which ${chalk.yellow('*component*')} would you like to add?`,
      name: 'component',
      type: 'list'
    }]);

    // Validate all flags values
    this.validate(options);

    // Then launch the dedicated generator
    await super.generate('components', answer.component, {
      ...options,
    });
  }
}
