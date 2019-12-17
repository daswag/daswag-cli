import {GeneratorBase} from '../../generator-base';
import Api = require("../../generators/services/Api");

export class CreateApi extends GeneratorBase {
  public static description = 'add an Api service';

  public static args = [];

  public static flags = {};

  public loggerName() {
    return 'create:api';
  }

  public async run() {
    const {flags: options, args} = this.parse(CreateApi);

    // Validate all flags values
    this.validate(options);

    // Then launch the dedicated generator
    await super.generate('services', Api.GENERATOR_TYPE, {
      ...options
    });
  }
}
