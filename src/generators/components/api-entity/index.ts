import chalk from "chalk";
import * as changeCase from "change-case";
import * as path from "path";
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

  private readonly skipChecks: boolean;
  private readonly rootPath: string;

  constructor(args: string | string[], options: any) {
    super(args, options);
    this.skipChecks = options.skipChecks;
    this.rootPath = options.path ? options.path : this.destinationRoot();
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
    // List current entities
    if(this.opts.entities && this.opts.entities.length > 0) {
      this.log(`You currently have created those entities: ${chalk.yellow(prompt.displayEntities(this.opts.entities))}`);
    } else {
      this.log(`You do not have any entity created.`);
    }
    // Get Entity name
    let answerName = await prompt.askForEntityName(this.newEntity.name, this.opts.entities) as any;
    if (answerName && answerName.name) {
      answerName = {
        name: changeCase.pascalCase(answerName.name),
        nameCamelCase: changeCase.pascalCase(answerName.name),
        nameKebabCase: changeCase.paramCase(answerName.name),
        nameSnakeCase: changeCase.snakeCase(answerName.name),
      }
    }

    const answerType = await prompt.askForEntityType(this.newEntity.type) as any;
    let answerLinkedEntityName = {};
    let answerAttributes = {};
    if(answerType && answerType.type === ApiEntityPrompts.ENTITY_TYPE_OBJECT_VALUE) {
      answerAttributes = await prompt.askForEntitySchema();
    } else if(answerType && answerType.type === ApiEntityPrompts.ENTITY_TYPE_ARRAY_VALUE) {
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

    if(!this.opts.entities) {
      this.opts.entities = [];
    }

    // Check if entity already exist
    let entityExist = false;
    this.opts.entities.forEach((entity: IEntitySchema) => {
      if(entity.name === this.newEntity.name) {
        entityExist = true;
      }
    });

    if(!entityExist) {
      this.opts.entities.push(this.newEntity);
    }
  }

  public async configuring() {
    this.logger.debug('Configuring phase start');
  }

  public default() {
    this.logger.debug('Default phase start');
    // Update resources
    this.logger.info(JSON.stringify(this.opts));
    this.config.set('entities', this.opts.entities);
    this.config.save();
  }

  public writing() {
    this.logger.debug('Writing phase start');
    // Copy new files
    new ApiEntityFiles(this, this.opts, this.newEntity).writeFiles();

    // Then add entity to swagger file
    const swaggerPath = path.join(this.destinationPath(), 'specs/specs.yaml');
    const content = YamlUtils.readYaml(swaggerPath);
    if(content) {
     YamlUtils.addSwaggerEntity(content, this.newEntity);
     YamlUtils.dumpYaml(content, swaggerPath);
    }
  }

  public install() {
    this.logger.debug('Installing phase start');
  }

  public end() {
    this.logger.debug('Ending phase start');
    this.log(`Your new ${chalk.red('entity')} has been generated.`);
  }
}

export = ApiEntity
