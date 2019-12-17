import chalk from "chalk";
import {GeneratorBase} from '../../generator-base';
import {ConstantsUtils} from "../../utils/constants-utils";

export class New extends GeneratorBase {
  public static description = 'Create a new application';

  public static args = [];

  public static flags = {};

  public loggerName() {
    return 'new';
  }

  public async run() {
    const {flags: options, args} = this.parse(New);

    // Check if we are on a project folder (.yo-rc.json exists)
    if(this.isWorkspace()) {
      this.log(`${chalk.red('It seems you already are on a daSWAG project. This command can only be used on an empty directory.\n')}`);
      return
    }

    // Prompt question to choose which type of project user want to generate
    this.log(`You will now create a new ${chalk.blueBright.bold('daSWAG')} application`);

    // Validate all flags values
    this.validate(options);

    // Then launch the dedicated generator
    await super.generate('', 'App', {
      ...options,
      action: ConstantsUtils.ACTION_INIT,
    });
  }
}
