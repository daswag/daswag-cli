import chalk from "chalk";
import * as changeCase from "change-case";
import * as path from "path";
import {ConstantsUtils} from "../../../utils/constants-utils";
import Utils from "../../../utils/utils";
import {YamlUtils} from "../../../utils/yaml-utils";
import {Base} from '../../core/base';
import {IApiOptions, IApiParameter, IApiResourceOptions} from "../../model/api-options.model";
import {ApiResourceFiles} from "./api-resource-files";
import {ApiResourcePrompts} from "./api-resource-prompts";

/**
 * Generator used to create a new client component.
 */
class ApiResource extends Base {

  public static GENERATOR_TYPE = 'ApiResource';

  private opts: IApiOptions = {};
  private newResource : IApiResourceOptions;
  private createOrUpdateResources: IApiResourceOptions[] = [];

  private readonly baseResourcePath: string;
  private readonly skipChecks: boolean;
  private readonly action: string;

  constructor(args: string | string[], options: any) {
    super(args, options);
    this.skipChecks = options.skipChecks;
    this.action = options.action;
    this.newResource = {
      name: options.name,
      nameCamelCase: changeCase.pascalCase(options.name ? options.name : ''),
      nameKebabCase: changeCase.paramCase(options.name ? options.name : ''),
      nameSnakeCase: changeCase.snakeCase(options.name ? options.name : ''),
      path: options.path,
    };
    this.baseResourcePath = options.baseResourcePath;
    this.registerPrettierTransform()
  }

  public loggerName(): string {
    return "generator:api-resource";
  }

  public async initializing() {
    this.logger.debug('Initializing phase start');
    this.opts =  {
      ...this.opts,
      ...this.config.getAll()
    };
  }

  public async prompting() {
    this.logger.debug('Prompting phase start');
    // Get ApiMethod prompts
    const prompt = new ApiResourcePrompts(this);
    if(this.action && this.action === ConstantsUtils.ACTION_UPDATE && this.opts.resources && this.opts.resources.length > 0) {
      const answerUpdatedResources = await prompt.askForUpdatedResources(this.opts.resources);
      if (answerUpdatedResources && answerUpdatedResources.updatedResources && answerUpdatedResources.updatedResources.length > 0) {
        this.log(`You currently have created those resource paths:`);
        this.opts.resources.forEach((resource: IApiResourceOptions) => {
          this.log(`- ${resource.path}`);
        });
        this.opts.resources.forEach((resource: IApiResourceOptions) => {
          if (answerUpdatedResources.updatedResources.indexOf(resource.path) !== -1) {
            // Entity is present in the list
            this.createOrUpdateResources.push(resource);
          }
        });
      }
    } else if(this.action && this.action === ConstantsUtils.ACTION_UPDATE && (!this.opts.entities || this.opts.entities.length === 0)) {
      this.log(`You do not have any resource to update.`);
    }
    else {
      const answerBaseResourcePath = await prompt.askForBaseResourcePath(this.baseResourcePath, this.opts.resources);
      let baseResourcePath = ApiResourcePrompts.DEFAULT_ROOT_PATH_VALUE;
      if (answerBaseResourcePath && answerBaseResourcePath.baseResourcePath) {
        baseResourcePath = answerBaseResourcePath.baseResourcePath;
      }

      // Get Resource name
      let answerName: any;
      if (this.opts.resources && this.opts.resources.length > 0) {
        answerName = await prompt.askForResourceName(this.newResource.name, this.opts.resources);
      }

      if (!answerName || !answerName.name || answerName.name === ApiResourcePrompts.RESOURCE_NAME_NEW) {
        answerName = await prompt.askForNewResourceName(this.opts.resources);
      }

      if (answerName && answerName.name) {
        answerName = {
          name: changeCase.pascalCase(answerName.name),
          nameCamelCase: changeCase.pascalCase(answerName.name),
          nameKebabCase: changeCase.paramCase(answerName.name),
          nameSnakeCase: changeCase.snakeCase(answerName.name),
        }
      }

      // Get resource path
      const answerPath = await prompt.askForPath(this.newResource.path, baseResourcePath, this.opts.resources);

      const baseResourcePathParam: IApiParameter[] = Utils.getResourcePathParam(baseResourcePath, this.opts.resources);
      // Get path parameters
      const answerParameters = await prompt.askForParameters(baseResourcePathParam);

      // Build new Resource
      this.newResource = {
        ...this.newResource,
        ...answerName,
        ...answerPath,
        ...answerParameters,
      };

      if (!this.opts.resources) {
        this.opts.resources = [];
      }

      this.opts.resources.push(this.newResource);

      this.createOrUpdateResources.push(this.newResource);
    }
  }

  public async configuring() {
    this.logger.debug('Configuring phase start');
  }

  public default() {
    this.logger.debug('Default phase start');
    // Update resources
    this.config.set('resources', this.opts.resources);
    this.config.save();
  }

  public writing() {
    this.logger.debug('Writing phase start');
    if(!this.createOrUpdateResources || this.createOrUpdateResources.length === 0) {
      this.log('No resource to create or update.')
    } else {
      const swaggerPath = path.join(this.destinationPath(), 'specs/specs.yaml');
      const content = YamlUtils.readYaml(swaggerPath);
      this.createOrUpdateResources.forEach((resource:IApiResourceOptions) => {
        this.log(`${chalk.yellow('- Generating new files and updating OpenApi specification for your resource')} ${chalk.blue(resource.path ? resource.path : '')}`);
        new ApiResourceFiles(this, resource).writeFiles();
        // Add resource to swagger file
        if (content) {
          YamlUtils.addSwaggerResource(content, resource);
        }
      });
      YamlUtils.dumpYaml(content, swaggerPath);
    }
  }

  public install() {
    this.logger.debug('Installing phase start');
  }

  public end() {
    this.logger.debug('Ending phase start');
    this.log(`Your new ${chalk.red('resource')} has been generated.`);
  }
}

export = ApiResource
