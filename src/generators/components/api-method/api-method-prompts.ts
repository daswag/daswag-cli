import chalk from "chalk";
import * as Generator from "yeoman-generator";
import {Prompt} from '../../core/prompt';
import {IApiMethodOptions, IApiResourceOptions} from "../../model/api-options.model";
import {IEntitySchema} from "../../model/options.model";

export class ApiMethodPrompts extends Prompt  {

  public static  GET_METHOD_VALUE = 'get';
  public static  PUT_METHOD_VALUE = 'put';
  public static  DELETE_METHOD_VALUE = 'delete';
  public static  POST_METHOD_VALUE = 'post';

  public async askForResourcePath(configValue: string | undefined, resources: IApiResourceOptions[] | undefined): Promise<Generator.Answers> {
    const resourceChoices : any[] = [];
    // Create resource choices
    if(resources) {
      resources.forEach((resource: IApiResourceOptions) => {
        resourceChoices.push({name: resource.path, value: resource.path})
      });
    }

    return configValue === undefined ? this.generator.prompt([{
      choices: resourceChoices,
      message: `Please, select a base ${chalk.yellow('*resource* path')} to add your method?`,
      name: 'resourcePath',
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
      message: `Which ${chalk.yellow('*Method*')} would you like to implement?`,
      name: 'type',
      type: 'list',
    }]) : { type : configValue };
  }

  public async askForMethodSummary(configValue: string | undefined): Promise<Generator.Answers> {
    return configValue === undefined ? this.generator.prompt([{
      message: `What is the summary of your method?'`,
      name: 'summary',
      type: 'input',
    }]) : { summary : configValue };
  }

  public async askForMethodName(configValue: string | undefined, resources: IApiResourceOptions[] | undefined): Promise<Generator.Answers> {
    return configValue === undefined ? this.generator.prompt([{
      message: `What is the name of your method?'`,
      name: 'name',
      type: 'input',
      validate: (input: string) => {
        if (!/^([a-zA-Z]*)$/.test(input)) {
          return `Your method name cannot contain special characters or a blank space`;
        }
        let exist: boolean = false;
        if(resources) {
          resources.forEach((resource: IApiResourceOptions) => {
            if(resource.methods) {
              resource.methods.forEach((method: IApiMethodOptions) => {
                if(method.name === input) {
                  exist = true;
                }
              });
            }
          });
        }
        if(exist) {
          return 'This method name already exist. Please choose another one.'
        }
        return true;
      }
    }]) : { name : configValue };
  }

  public async askForUpdatedMethods(resources: IApiResourceOptions[] | undefined): Promise<Generator.Answers> {
    const methodChoices : any = [];
    if(resources) {
      resources.forEach((resource: IApiResourceOptions) => {
        if(resource.methods) {
          resource.methods.forEach((method: IApiMethodOptions) => {
            methodChoices.push({name: `${resource.path} : ${method.type} - ${method.nameCamelCase}`, value: method.nameCamelCase});
          });
        }
      });
    }
    return this.generator.prompt([{
      choices: methodChoices,
      message: `Which methods would you like to update?`,
      name: 'updatedMethods',
      type: 'checkbox',
    }]);
  }
}
