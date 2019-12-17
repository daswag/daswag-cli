import chalk from "chalk";
import * as changeCase from "change-case";
import * as path from "path";
import ConfigUtils from "../../../utils/config-utils";
import Utils from "../../../utils/utils";
import {YamlUtils} from "../../../utils/yaml-utils";
import {Base} from '../../core/base';
import {IApiOptions, IApiResourceOptions} from "../../model/api-options.model";
import {ApiResourceFiles} from "./api-resource-files";
import {ApiResourcePrompts} from "./api-resource-prompts";

/**
 * Generator used to create a new client component.
 */
class ApiResource extends Base {

  public static GENERATOR_TYPE = 'ApiResource';

  private opts: IApiOptions = {};
  private newResource : IApiResourceOptions;
  private readonly rootResourceName: string;

  private readonly skipChecks: boolean;

  constructor(args: string | string[], options: any) {
    super(args, options);
    this.skipChecks = options.skipChecks;
    this.newResource = {
      name: options.name,
      nameCamelCase: changeCase.pascalCase(options.name ? options.name : ''),
      nameKebabCase: changeCase.paramCase(options.name ? options.name : ''),
      nameSnakeCase: changeCase.snakeCase(options.name ? options.name : ''),
      path: options.path
    };
    this.rootResourceName = options.rootResourceName;
    this.registerPrettierTransform()
  }

  public loggerName(): string {
    return "generator:api-resource";
  }

  public async initializing() {
    this.logger.debug('Initializing phase start');
    // Load from configuration file
    this.logger.debug('Getting information from configuration');
    this.opts = ConfigUtils.getApiConfig(this.opts, this);
  }

  public async prompting() {
    this.logger.debug('Prompting phase start');
    // Get ApiMethod prompts
    const prompt = new ApiResourcePrompts(this);
    this.log(`Let's configure our ${chalk.red('Resource')} component.`);
    // Choose root resource
    const answerRootResource = await prompt.askForRootResource(this.rootResourceName, this.opts.resources);

    // Get Resource name
    let answerName = await prompt.askForResourceName(this.newResource.name) as any;
    if (answerName && answerName.name) {
      answerName = {
        name: answerName.name,
        nameCamelCase: changeCase.pascalCase(answerName.name),
        nameKebabCase: changeCase.paramCase(answerName.name),
        nameSnakeCase: changeCase.snakeCase(answerName.name),
      }
    }

    const answerPath = await prompt.askForPath(this.newResource.path, this.newResource.nameKebabCase) as any;

    // Build new Resource
    this.newResource = {
      ...this.newResource,
      ...answerName,
      ...answerPath,
    };

    if(!this.opts.resources) {
      this.opts.resources = [];
    }

    // Finally, add this resource
    if(answerRootResource.rootResource && answerRootResource.rootResource === ApiResourcePrompts.DEFAULT_ROOT_PATH_VALUE) {
      this.opts.resources.push(this.newResource);
    } else {
      // Find root resource to bind the new one
      const rootResource = Utils.findResource(answerRootResource.rootResource, this.opts.resources);
      if(rootResource) {
        if(!rootResource.resources) {
          rootResource.resources = [];
        }
        rootResource.resources.push(this.newResource);
      }
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
    // Write Api Resources files
    new ApiResourceFiles(this, this.newResource).writeFiles();

    // Add resource to swagger file
    const swaggerPath = path.join(this.destinationPath(), 'specs/specs.yaml');
    const content = YamlUtils.readYaml(swaggerPath);
    if(content) {
      YamlUtils.addSwaggerResource(content, this.newResource);
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
