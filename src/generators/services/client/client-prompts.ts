import chalk from 'chalk';
import * as Generator from "yeoman-generator";
import {Prompt} from '../../core/prompt';

export class ClientPrompts extends Prompt  {

  public static FRAMEWORK_ANGULAR_VALUE = 'angular';
  public static PACKAGE_MANAGER_YARN_VALUE = 'yarn';
  public static PACKAGE_MANAGER_NPM_VALUE = 'npm';
  public static CLIENT_THEME_NONE_VALUE = "none";

  public async askForFramework(configValue: string | undefined): Promise<Generator.Answers> {
    return configValue === undefined ? this.generator.prompt([{
      choices: [{name: 'Angular', value:ClientPrompts.FRAMEWORK_ANGULAR_VALUE}],
      default: ClientPrompts.FRAMEWORK_ANGULAR_VALUE,
      message: `${chalk.red('Client')} - Which ${chalk.yellow('*Framework*')} would you like to use?`,
      name: 'framework',
      type: 'list',
    }]) : { framework: configValue };
  }

  public async askForPackageManager(configValue: string | undefined): Promise<Generator.Answers> {
    return configValue === undefined ? this.generator.prompt([ {
      choices: [
        {name: 'Yarn', value:ClientPrompts.PACKAGE_MANAGER_YARN_VALUE},
        {name: 'Npm', value:ClientPrompts.PACKAGE_MANAGER_NPM_VALUE}],
      default: ClientPrompts.PACKAGE_MANAGER_YARN_VALUE,
      message: `${chalk.red('Client')} - Which ${chalk.yellow('*Package Manager*')} would you like to use?`,
      name: 'packageManager',
      type: 'list',
    }]) : { packageManager: configValue};
  }

  public async askForClientTheme(configValue: string | undefined): Promise<Generator.Answers> {
    return configValue === undefined ? this.generator.prompt([ {
      choices: [
        {
          name: 'No theme (bootstrap only)',
          value: ClientPrompts.CLIENT_THEME_NONE_VALUE,
        },
        { value: 'cerulean', name: 'Cerulean' },
        { value: 'cosmo', name: 'Cosmo' },
        { value: 'cerulean', name: 'Cyborg' },
        { value: 'darkly', name: 'Darkly' },
        { value: 'flatly', name: 'Flatly' },
        { value: 'journal', name: 'Journal' },
        { value: 'litera', name: 'Litera' },
        { value: 'lumen', name: 'Lumen' },
        { value: 'lux', name: 'Lux' },
        { value: 'materia', name: 'Materia' },
        { value: 'minty', name: 'Minty' },
        { value: 'pulse', name: 'Pulse' },
        { value: 'sandstone', name: 'Sandstone' },
        { value: 'simplex', name: 'Simplex' },
        { value: 'sketchy', name: 'Sketchy' },
        { value: 'slate', name: 'Slate' },
        { value: 'solar', name: 'Solar' },
        { value: 'spacelab', name: 'Spacelab' },
        { value: 'superhero', name: 'Superhero' },
        { value: 'united', name: 'United' },
        { value: 'yeti', name: 'Yeti' }
      ],
      default: ClientPrompts.CLIENT_THEME_NONE_VALUE,
      message: `${chalk.red('Client')} - Would you like to use ${chalk.yellow('*Bootswatch*')} theme (https://bootswatch.com/)?`,
      name: 'clientTheme',
      type: 'list',
    }]) : { clientTheme: configValue};
  }

}
