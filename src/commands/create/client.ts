import {GeneratorBase} from '../../generator-base';
import Client = require("../../generators/services/client");
import {ConstantsUtils} from "../../utils/constants-utils";

export class CreateClient extends GeneratorBase {
  public static description = 'add a client service';

  public static args = [];

  public static flags = {};

  public loggerName() {
    return 'create:client';
  }

  public async run() {
    const {flags: options, args} = this.parse(CreateClient);

    // Validate all flags values
    this.validate(options);

    // Then launch the dedicated generator
    await super.generate('services', Client.GENERATOR_TYPE, {
      ...options,
    });
  }
}
