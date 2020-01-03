import chalk from "chalk";
import * as Generator from "yeoman-generator";
import {ConstantsUtils} from "../../../utils/constants-utils";
import {Prompt} from '../../core/prompt';
import {IApiMethodOptions, IApiParameter, IApiResourceOptions} from "../../model/api-options.model";

export class ApiResourcePrompts extends Prompt  {

  public static DEFAULT_ROOT_PATH_VALUE = '/';
  public static RESOURCE_NAME_NEW = 'NEW';

  public async askForPath(configValue: string | undefined, resourcePath: string | undefined, resources: IApiResourceOptions[] | undefined): Promise<Generator.Answers> {
    return configValue === undefined ? this.generator.prompt([{
      default: resourcePath,
      message: `What's your resource ${chalk.yellow('*Path*')}?`,
      name: 'path',
      type: 'input',
      validate: (input: string) => {
        let exist: boolean= false;
        if(resources) {
          resources.forEach((resource: IApiResourceOptions) => {
            if(resource.path === input) {
              exist = true;
            }
          });
        }
        if(exist) {
          return `Your resource path already exist, please choose another one.`;
        }
        return true;
      }
    }]) : { name : configValue };
  }

  public async askForBaseResourcePath(defaultValue: string | undefined, resources: IApiResourceOptions[] | undefined): Promise<Generator.Answers> {
    const resourceChoices : any[] = [];
    // Create resource choices
    resourceChoices.push({name: `Default root path (${ApiResourcePrompts.DEFAULT_ROOT_PATH_VALUE})`, value: ApiResourcePrompts.DEFAULT_ROOT_PATH_VALUE})
    if(resources) {
      resources.forEach((resource: IApiResourceOptions) => {
        resourceChoices.push({name: resource.path, value: resource.path});
      });
    }

    return this.generator.prompt([{
      choices: resourceChoices,
      default: defaultValue,
      message: `Please, select your ${chalk.yellow('*Base resource path*')}?`,
      name: 'baseResourcePath',
      type: 'list',
    }]);
  }

  public async askForResourceName(configValue: string | undefined, resources: IApiResourceOptions[]): Promise<Generator.Answers> {
    const resourceChoices : any[] = [];
    // Create resource choices
    resourceChoices.push({name: `Create a new one`, value: ApiResourcePrompts.RESOURCE_NAME_NEW});
    if(resources) {
      resources.forEach((resource: IApiResourceOptions) => {
        resourceChoices.push({name: resource.name, value: resource.name});
      });
    }
    return configValue === undefined ? this.generator.prompt([{
      choices: resourceChoices,
      message: `Which resource is linked to your path?`,
      name: 'name',
      type: 'list',
    }]) : { name : configValue };
  }

  public async askForNewResourceName(resources: IApiResourceOptions[] | undefined): Promise<Generator.Answers> {
    return this.generator.prompt([{
      message: `What is the name of your resource?'`,
      name: 'name',
      type: 'input',
      validate: (input: string) => {
        if (!/^([a-zA-Z]*)$/.test(input)) {
          return `Your resource name cannot contain special characters or a blank space`;
        }
        let exist: boolean= false;
        if(resources) {
          resources.forEach((resource: IApiResourceOptions) => {
            if(resource.name === input) {
              exist = true;
            }
          });
        }
        if(exist) {
          return `Your resource name already exist, please choose another one.`;
        }
        return true;
      }
    }]);
  }

  public async askForParameters(params: IApiParameter[]): Promise<Generator.Answers> {
    const resourceParameters: IApiParameter[] = [];
    if(params) {
      resourceParameters.push(...params);
    }

    this.displayParams(resourceParameters);

    let answerAddParam = await this.askForAddParam();
    while(answerAddParam && answerAddParam.addParam) {
      let param : IApiParameter = {};
      const answerName = await this.askForParameterName();
      const answerType = await this.askForParameterType();
      const answerDescription = await this.askForParameterDescription();
      const answerAttributeDataType = await this.askForAttributeDataType();
      const answerRequired = await this.askForRequired();

      param = {
        ...answerName,
        ...answerDescription,
        ...answerRequired,
        ...answerType,
        ...answerAttributeDataType,
        ...answerRequired,
      };
      // Then add it to schema
      resourceParameters.push(param);

      // Display current user schemas
      this.displayParams(resourceParameters);

      // Finally, ask for a new attribute
      answerAddParam = await this.askForAddParam();
    }

    return {
      parameters: resourceParameters
    };
  }

  public async askForParameterName(): Promise<Generator.Answers> {
    return this.generator.prompt([{
      message: `What is the name of your parameter?`,
      name: 'name',
      type: 'input',
      validate: (input: string) => {
        if (!/[\w-:]{0,20}/.test(input)) {
          return 'Your parameter name is not valid.';
        }
        return true;
      }
    }]);
  }

  public async askForParameterType(): Promise<Generator.Answers> {
    return this.generator.prompt([{
      choices: [
        {name: 'Path', value:ConstantsUtils.PATH_PATH},
        {name: 'Query', value:ConstantsUtils.QUERY_PARAM},
      ],
      message: `Which ${chalk.yellow('type')} of parameter is it?`,
      name: 'type',
      type: 'list'
    }]);
  }

  public async askForParameterDescription(): Promise<Generator.Answers> {
    return this.generator.prompt([{
      message: `What is the description of your parameter?`,
      name: 'description',
      type: 'input'
    }]);
  }

  public async askForAddParam(): Promise<Generator.Answers> {
    return this.generator.prompt([ {
      message: `Do you want to add a parameter to your resource?`,
      default: false,
      name: 'addParam',
      type: 'confirm',
    }]);
  }

  public async askForUpdatedResources(resources: IApiMethodOptions[] | undefined): Promise<Generator.Answers> {
    const resourceChoices : any = [];
    if(resources) {
      resources.forEach((resource: IApiResourceOptions) => {
        resourceChoices.push({name: resource.path, value: resource.path});
      });
    }
    return this.generator.prompt([{
      choices: resourceChoices,
      message: `Which resources path would you like to update?`,
      name: 'updatedResources',
      type: 'checkbox',
    }]);
  }

  private displayParams(resourceParameters: IApiParameter[]) {
    if(resourceParameters && resourceParameters.length > 0) {
      this.generator.log(`You have already declare those parameters:`);
      resourceParameters.forEach((param: IApiParameter) => {
        this.generator.log(`- ${param.type ? param.type.toUpperCase() : ''} ${param.name}:${param.attributeDataType} - ${param.description}`);
      });
    } else {
      this.generator.log(`You do not have any parameters declared for your resource.`);
    }
  }
}
