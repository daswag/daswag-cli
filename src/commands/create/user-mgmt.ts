import {GeneratorBase} from '../../generator-base';
import App = require("../../generators/app");
import UserMgmt = require("../../generators/services/user-mgmt");

export class CreateUserMgmt extends GeneratorBase {
  public static description = 'create an user management service';

  public static args = [];

  public static flags = {};

  public loggerName() {
    return 'create:user-mgmt';
  }

  public async run() {
    const {flags: options, args} = this.parse(CreateUserMgmt);

    // Check if we are on a project folder (.yo-rc.json exists)
    this.checkWorkspace(App.GENERATOR_TYPE);

    // Validate all flags values
    this.validate(options);

    // Then launch the dedicated generator
    await super.generate('services', UserMgmt.GENERATOR_TYPE, {
      ...options,
    });
  }
}
