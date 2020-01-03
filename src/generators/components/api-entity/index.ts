import chalk from "chalk";
import * as changeCase from "change-case";
import * as path from "path";
import {ConstantsUtils} from "../../../utils/constants-utils";
import {YamlUtils} from "../../../utils/yaml-utils";
import {Base} from '../../core/base';
import {IApiOptions} from "../../model/api-options.model";
import {IEntitySchema} from "../../model/options.model";
import {ApiEntityFiles} from "./api-entity-files";
import {ApiEntityPrompts} from "./api-entity-prompts";

/**
 * Generator used to create a new client component.
 */
class ApiEntity extends Base {

  public static GENERATOR_TYPE = 'ApiEntity';

  private opts: IApiOptions = {};
  private newEntity : IEntitySchema;
  private createOrUpdateEntities: IEntitySchema[] = [];

  private readonly skipChecks: boolean;
  private readonly rootPath: string;
  private readonly action: string;

  constructor(args: string | string[], options: any) {
    super(args, options);
    this.skipChecks = options.skipChecks;
    this.rootPath = options.path ? options.path : this.destinationRoot();
    this.action = options.action;
    this.newEntity = {
      name: options.name,
      nameCamelCase: changeCase.pascalCase(options.name ? options.name : ''),
      nameKebabCase: changeCase.paramCase(options.name ? options.name : ''),
      nameSnakeCase: changeCase.snakeCase(options.name ? options.name : ''),
      type: options.type,
      linkedEntityName: options.linkedEntityName,
    };
    this.registerPrettierTransform()
  }

  public loggerName(): string {
    return "generator:api-entity";
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
    const prompt = new ApiEntityPrompts(this);
    // In case of Update action, we need to get the list of entity to update
    if(this.action && this.action === ConstantsUtils.ACTION_UPDATE &&  this.opts.entities && this.opts.entities.length > 0) {
      this.log(`You currently have created those entities:`);
      this.opts.entities.forEach((entity: IEntitySchema) => {
        this.log(`- ${entity.name}: ${entity.type}`);
      });
      const answerUpdatedEntities = await prompt.askForUpdatedEntities(this.opts.entities);
      if(answerUpdatedEntities && answerUpdatedEntities.updatedEntities && answerUpdatedEntities.updatedEntities.length > 0) {
        this.opts.entities.forEach((entity: IEntitySchema) => {
          if(answerUpdatedEntities.updatedEntities.indexOf(entity.name) !== -1) {
            // Entity is present in the list
            this.createOrUpdateEntities.push(entity);
          }
        });
      }
    } else if(this.action && this.action === ConstantsUtils.ACTION_UPDATE && (!this.opts.entities || this.opts.entities.length === 0)) {
      this.log(`You do not have any entity to update.`);
    } else {
      // Get Entity name for new entity
      let answerName = await prompt.askForEntityName(this.newEntity.name, this.opts.entities);
      if (answerName && answerName.name) {
        answerName = {
          name: changeCase.pascalCase(answerName.name),
          nameCamelCase: changeCase.pascalCase(answerName.name),
          nameKebabCase: changeCase.paramCase(answerName.name),
          nameSnakeCase: changeCase.snakeCase(answerName.name),
        }
      }

      const answerType = await prompt.askForEntityType(this.newEntity.type);
      let answerLinkedEntityName = {};
      let answerAttributes = {};
      if (answerType && answerType.type === ApiEntityPrompts.ENTITY_TYPE_OBJECT_VALUE) {
        answerAttributes = await prompt.askForEntitySchema();
      } else if (answerType && answerType.type === ApiEntityPrompts.ENTITY_TYPE_ARRAY_VALUE) {
        answerLinkedEntityName = await prompt.askForLinkedEntityName(this.opts.entities);
      }

      // Build new entity
      this.newEntity = {
        ...this.newEntity,
        ...answerName,
        ...answerType,
        ...answerLinkedEntityName,
        ...answerAttributes,
      };

      if (!this.opts.entities) {
        this.opts.entities = [];
      }

      // Add new entity
      this.opts.entities.push(this.newEntity);

      // Add entity to list of entities to create/update
      this.createOrUpdateEntities.push(this.newEntity);
    }
  }

  public async configuring() {
    this.logger.debug('Configuring phase start');
  }

  public default() {
    this.logger.debug('Default phase start');
    // Update resources
    this.config.set('entities', this.opts.entities);
    this.config.save();
  }

  public writing() {
    this.logger.debug('Writing phase start');
    if(!this.createOrUpdateEntities || this.createOrUpdateEntities.length === 0) {
      this.log('No entity to create or update.')
    } else {
      const swaggerPath = path.join(this.destinationPath(), 'specs/specs.yaml');
      const content = YamlUtils.readYaml(swaggerPath);
      this.createOrUpdateEntities.forEach((entity: IEntitySchema) => {
        // Copy new files
        this.log(`${chalk.yellow('- Generating new files and updating OpenApi specification for your entity')} ${chalk.blue(entity.name ? entity.name : '')}`);
        new ApiEntityFiles(this, this.opts, entity).writeFiles();
        if (content) {
          YamlUtils.addSwaggerEntity(content, entity);
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
    this.log(`Your ${chalk.red('entities')} has been created or updated correctly.`);
  }
}

export = ApiEntity
