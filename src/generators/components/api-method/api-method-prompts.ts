import chalk from "chalk";
import * as Generator from "yeoman-generator";
import {Prompt} from '../../core/prompt';
import {IApiResourceOptions} from "../../model/api-options.model";

export class ApiMethodPrompts extends Prompt  {

  public static  GET_METHOD_VALUE = 'get';
  public static  PUT_METHOD_VALUE = 'put';
  public static  DELETE_METHOD_VALUE = 'delete';
  public static  POST_METHOD_VALUE = 'post';

  public async askForResourceName(configValue: string | undefined, resources: IApiResourceOptions[] | undefined): Promise<Generator.Answers> {
    const resourceChoices : any[] = [];
    // Create resource choices
    if(resources) {
      resources.forEach((resource: IApiResourceOptions) => {
        resourceChoices.push({name: resource.name, value: resource.name})
      });
    }

    return configValue === undefined ? this.generator.prompt([{
      choices: resourceChoices,
      message: `${chalk.red('Method')} - Please, select a ${chalk.yellow('*Resource*')} to add your method?`,
      name: 'resourceName',
      type: 'list',
    }]) : { resourceName : configValue };
  }

  public async askForMethodType(configValue: string | undefined): Promise<Generator.Answers> {
    return configValue === undefined ? this.generator.prompt([{
      choices: [
        {name: 'GET', value: ApiMethodPrompts.GET_METHOD_VALUE},
        {name: 'POST', value: ApiMethodPrompts.POST_METHOD_VALUE},
        {name: 'PUT', value: ApiMethodPrompts.PUT_METHOD_VALUE},
        {name: 'DELETE', value: ApiMethodPrompts.DELETE_METHOD_VALUE},
      ],
      message: `${chalk.red('Method')} - Which ${chalk.yellow('*Method*')} would you like to implement?`,
      name: 'type',
      type: 'list',
    }]) : { type : configValue };
  }

  public async askForMethodSummary(configValue: string | undefined): Promise<Generator.Answers> {
    return configValue === undefined ? this.generator.prompt([{
      message: `${chalk.red('Method')} - What is the summary of your method?'`,
      name: 'summary',
      type: 'input',
    }]) : { summary : configValue };
  }

  public async askForMethodName(configValue: string | undefined): Promise<Generator.Answers> {
    return configValue === undefined ? this.generator.prompt([{
      message: `${chalk.red('Method')} - What is the name of your method?'`,
      name: 'name',
      type: 'input',
      validate: (input: string) => {
        if (!/^([a-zA-Z]*)$/.test(input)) {
          return `Your method name cannot contain special characters or a blank space`;
        }
        return true;
      }
    }]) : { name : configValue };
  }
}
