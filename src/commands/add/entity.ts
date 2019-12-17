import {GeneratorBase} from '../../generator-base';
import ApiEntity = require("../../generators/components/api-entity");
import Api = require("../../generators/services/api");

export class AddEntity extends GeneratorBase {
  public static description = 'add a new Api resource';

  public static args = [];

  public static flags = {};

  public loggerName() {
    return 'add:resource';
  }

  public async run() {
    const {flags: options, args} = this.parse(AddEntity);

    // Check if we are on a Api project folder
    this.checkWorkspace(Api.GENERATOR_TYPE);

    // Validate all flags values
    this.validate(options);

    // Then launch the dedicated generator
    await super.generate('components', ApiEntity.GENERATOR_TYPE, {
      ...options,
    });
  }
}
