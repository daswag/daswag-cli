import chalk from "chalk";
import * as Generator from "yeoman-generator";
import {Prompt} from '../../core/prompt';
import {IApiResourceOptions} from "../../model/api-options.model";

export class ApiResourcePrompts extends Prompt  {

  public static DEFAULT_ROOT_PATH_VALUE = '/';

  public async askForPath(configValue: string | undefined, name: string | undefined): Promise<Generator.Answers> {
    const defaultPath = ApiResourcePrompts.DEFAULT_ROOT_PATH_VALUE + name;
    return configValue === undefined ? this.generator.prompt([{
      default: ApiResourcePrompts.DEFAULT_ROOT_PATH_VALUE,
      message: `${chalk.red('Resource')} - What is your ${chalk.yellow('*Path*')}?`,
      name: 'path',
      type: 'input',
    }]) : { name : configValue };
  }

  public async askForRootResource(configValue: string | undefined, resources: IApiResourceOptions[] | undefined): Promise<Generator.Answers> {
    const resourceChoices : any[] = [];
    // Create resource choices
    resourceChoices.push({name: ApiResourcePrompts.DEFAULT_ROOT_PATH_VALUE, value: ApiResourcePrompts.DEFAULT_ROOT_PATH_VALUE})
    if(resources) {
      resources.forEach((resource: IApiResourceOptions) => {
        resourceChoices.push({name: resource.name, value: resource.name});
      });
    }

    return configValue === undefined ? this.generator.prompt([{
      choices: resourceChoices,
      message: `${chalk.red('Resource')} - Please, select a ${chalk.yellow('*Root Resource*')}?`,
      name: 'rootResource',
      type: 'list',
    }]) : { resourceName : configValue };
  }

  public async askForResourceName(configValue: string | undefined): Promise<Generator.Answers> {
    return configValue === undefined ? this.generator.prompt([{
      message: `${chalk.red('Resource')} - What is the name of your resource?'`,
      name: 'name',
      type: 'input',
      validate: (input: string) => {
        if (!/^([a-zA-Z]*)$/.test(input)) {
          return `Your resource name cannot contain special characters or a blank space`;
        }
        return true;
      }
    }]) : { name : configValue };
  }
}
