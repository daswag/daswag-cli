import {GeneratorBase} from '../../generator-base';
import ApiMethod = require("../../generators/components/api-method");
import Api = require("../../generators/services/api");

export class AddMethod extends GeneratorBase {
  public static description = 'generate a new Api method';

  public static args = [];

  public static flags = {};

  public loggerName() {
    return 'add:resource';
  }

  public async run() {
    const {flags: options, args} = this.parse(AddMethod);

    // Check if we are on a Api project folder
    this.checkWorkspace(Api.GENERATOR_TYPE);

    // Validate all flags values
    this.validate(options);

    // Then launch the dedicated generator
    await super.generate('components', ApiMethod.GENERATOR_TYPE, {
      ...options,
    });
  }
}
