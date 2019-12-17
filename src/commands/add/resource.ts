import {GeneratorBase} from '../../generator-base';
import ApiResource = require("../../generators/components/api-resource");
import Api = require("../../generators/services/api");

export class AddResource extends GeneratorBase {
  public static description = 'generate a new Api resource';

  public static args = [];

  public static flags = {};

  public loggerName() {
    return 'add:resource';
  }

  public async run() {
    const {flags: options, args} = this.parse(AddResource);

    // Check if we are on a Api project folder
    this.checkWorkspace(Api.GENERATOR_TYPE);

    // Validate all flags values
    this.validate(options);

    // Then launch the dedicated generator
    await super.generate('components', ApiResource.GENERATOR_TYPE, {
      ...options,
    });
  }
}
