import chalk from "chalk";
import * as changeCase from "change-case";
import * as path from "path";
import Utils from "../../../utils/utils";
import {YamlUtils} from "../../../utils/yaml-utils";
import {Base} from '../../core/base';
import {IApiMethodOptions, IApiOptions, IApiResourceOptions} from "../../model/api-options.model";
import {ApiMethodFiles} from "./api-method-files";
import {ApiMethodPrompts} from "./api-method-prompts";
/**
 * Generator used to create a new client component.
 */
class ApiMethod extends Base {

  public static GENERATOR_TYPE = 'ApiMethod';

  private opts: IApiOptions = {};
  private newMethod : IApiMethodOptions;
  private resourcePath: string;
  private createOrUpdateMethods: IApiMethodOptions[] = [];

  private readonly skipChecks: boolean;
  private readonly action: string;

  constructor(args: string | string[], options: any) {
    super(args, options);
    this.skipChecks = options.skipChecks;
    this.action = options.action;
    this.newMethod = {
      name: options.name,
      nameCamelCase: changeCase.pascalCase(options.name ? options.name : ''),
      nameSnakeCase: changeCase.snakeCase(options.name ? options.name : ''),
      type: options.type,
      linkedEntityName: options.linkedEntityName,
    };
    this.resourcePath = options.resourcePath;
    this.registerPrettierTransform()
  }

  public loggerName(): string {
    return "generator:api-method";
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
    const prompt = new ApiMethodPrompts(this);
    this.log(`Let's configure our ${chalk.red('Method')} component.`);
    // Check existing resources
    if(!this.opts.resources || this.opts.resources.length === 0) {
      this.logger.error('No resource configured. Exiting Method generator');
      this.log(`You don't have any resource configured. Please create a new resource by using the following command: ${chalk.yellow('daswag add:resource')}`);
      process.exit(0);
    } else {
      // Choose resource to bind method
      const answerResourcePath = await prompt.askForResourcePath(this.resourcePath, this.opts.resources);
      if(answerResourcePath && answerResourcePath.resourcePath) {
        this.resourcePath = answerResourcePath.resourcePath;
      }

      // Get Method type
      const answerType = await prompt.askForMethodType(this.newMethod.type);

      // Get Method name
      let answerName = await prompt.askForMethodName(this.newMethod.name, this.opts.resources);
      if (answerName && answerName.name) {
        answerName = {
          name: answerName.name,
          nameCamelCase: changeCase.pascalCase(answerName.name),
          nameSnakeCase: changeCase.snakeCase(answerName.name),
        }
      }

      const answerSummary = await prompt.askForMethodSummary(this.newMethod.summary);

      // Linked entity to method outputs
      const answerLinkedEntityName = await prompt.askForLinkedEntityName(this.opts.entities);

      // Build new  Method
      this.newMethod = {
        ...this.newMethod,
        ...answerName,
        ...answerType,
        ...answerSummary,
        ...answerLinkedEntityName,
      };
      this.logger.debug('New method content: ' + JSON.stringify(this.newMethod));

      // Find resource
      const foundedResource = Utils.findResourceByPath(this.resourcePath, this.opts.resources);
      if(foundedResource) {
        if(!foundedResource.methods) {
          foundedResource.methods = [];
        }
        foundedResource.methods.push(this.newMethod);
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
    if(this.opts.resources) {
      const resource : IApiResourceOptions | undefined = Utils.findResourceByPath(this.resourcePath, this.opts.resources);
      // Copy new files
      if(resource && resource.nameKebabCase) {
        new ApiMethodFiles(this, this.opts, resource.nameKebabCase, this.newMethod).writeFiles();

        // Update swagger file content
        const swaggerPath = path.join(this.destinationPath(), 'specs/specs.yaml');
        const content = YamlUtils.readYaml(swaggerPath);
        if (content && resource) {
          YamlUtils.addSwaggerMethod(content, resource, this.newMethod);
          YamlUtils.dumpYaml(content, swaggerPath);
        }

        // Update template file content
        const templatePath = path.join(this.destinationPath(), 'template.yaml');
        const templateContent = YamlUtils.readYaml(templatePath);
        if (templateContent && resource) {
          YamlUtils.addTemplateFunction(templateContent, resource, this.newMethod);
          YamlUtils.dumpYaml(templateContent, templatePath);
        }
      }
    }
  }

  public install() {
    this.logger.debug('Installing phase start');
  }

  public end() {
    this.logger.debug('Ending phase start');
    this.log(`Your new ${chalk.red('method')} has been generated.`);
  }
}

export = ApiMethod
