import chalk from "chalk";
import {GeneratorBase} from '../../generator-base';
import Api = require('../../generators/services/api');
import Client = require('../../generators/services/client');
import UserMgmt = require("../../generators/services/user-mgmt");

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
        // Then launch the dedicated generator
        await super.generate('services', type, {
          ...options,
        });
      } else {
        this.log(`${chalk.red('Update command cannot be applied to this directory. Be sure to execute it on a daSWAG service directory.')}`)
      }
    }
  }
}
