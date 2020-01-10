import chalk from "chalk";
import * as changeCase from "change-case";
import * as path from "path";
import Utils from "../../../utils/utils";
import {YamlUtils} from "../../../utils/yaml-utils";
import {Base} from '../../core/base';
import {IApiMethodOptions, IApiOptions, IApiResourceOptions} from "../../model/api-options.model";
import {ApiMethodFiles} from "./api-method-files";
import {ApiMethodPrompts} from "./api-method-prompts";
import {ConstantsUtils} from "../../../utils/constants-utils";
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
    if(this.action && this.action === ConstantsUtils.ACTION_UPDATE && this.opts.resources && this.opts.resources.length > 0) {
      this.log(`You currently have created those methods:`);
      this.opts.resources.forEach((resource: IApiResourceOptions) => {
        this.log(`${resource.path}`);
        if(resource.methods) {
          resource.methods.forEach((method: IApiMethodOptions) => {
            this.log(`- ${method.type ? method.type.toUpperCase() : ''} - ${method.nameCamelCase}`);
          });
        }
      });

      const answerUpdatedMethods = await prompt.askForUpdatedMethods(this.opts.resources);
      if (answerUpdatedMethods && answerUpdatedMethods.updatedMethods && answerUpdatedMethods.updatedMethods.length > 0) {
        this.opts.resources.forEach((resource: IApiResourceOptions) => {
          if(resource.methods) {
            resource.methods.forEach((method: IApiMethodOptions) => {
              if (answerUpdatedMethods.updatedMethods.indexOf(method.name) !== -1) {
                // Entity is present in the list
                this.createOrUpdateMethods.push(method);
              }
            });
          }
        });
      }
    } else if(this.action && this.action === ConstantsUtils.ACTION_UPDATE && (!this.opts.resources || this.opts.resources.length === 0)) {
      this.log(`You do not have any methods to update.`);
    }
    else {
      // Check existing resources
      if (!this.opts.resources || this.opts.resources.length === 0) {
        this.logger.error('No resource configured. Exiting Method generator');
        this.log(`You don't have any resource configured. Please create a new resource first by using the following command: ${chalk.yellow('daswag add:resource')}`);
        process.exit(0);
      } else {
        // Choose resource to bind method
        const answerResourcePath = await prompt.askForResourcePath(this.resourcePath, this.opts.resources);
        if (answerResourcePath && answerResourcePath.resourcePath) {
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
        if (foundedResource) {
          if (!foundedResource.methods) {
            foundedResource.methods = [];
          }
          foundedResource.methods.push(this.newMethod);
          // Then add it to the list of methods to create/update
          this.createOrUpdateMethods.push(this.newMethod);
        }
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
    if(!this.createOrUpdateMethods || this.createOrUpdateMethods.length === 0) {
      this.log('No methods to create or update.');
    } else {
      if(this.opts.resources) {
        const swaggerPath = path.join(this.destinationPath(), 'specs/specs.yaml');
        const swaggerContent = YamlUtils.readYaml(swaggerPath);
        const templatePath = path.join(this.destinationPath(), 'template.yaml');
        const templateContent = YamlUtils.readYaml(templatePath);
        this.createOrUpdateMethods.forEach((method: IApiMethodOptions) => {
          if(method.name) {
            const resource: IApiResourceOptions | undefined = Utils.findResourceByMethodName(method.name, this.opts.resources);
            // Copy new files
            if (resource && resource.nameKebabCase) {
              new ApiMethodFiles(this, this.opts, resource, method).writeFiles();

              // Update swagger file content
              if (swaggerContent && resource) {
                YamlUtils.addSwaggerMethod(swaggerContent, resource, method);
                YamlUtils.dumpYaml(swaggerContent, swaggerPath);
              }

              // Update template file content
              if (templateContent && resource) {
                YamlUtils.addTemplateFunction(templateContent, resource, method);
                YamlUtils.dumpYaml(templateContent, templatePath);
              }
            }
          }
        });
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
