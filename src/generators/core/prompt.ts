import chalk from "chalk";
import {StringUtils} from "turbocommons-ts";
import * as Generator from "yeoman-generator";
import {IAttributeSchema, IEntitySchema} from "../model/options.model";
import {Base} from './base';

export class Prompt {

  public static PROVIDER_AWS_VALUE = 'aws';
  public static IAC_SAM_VALUE = 'sam';

  public static ADD_ATTRIBUTE_NONE_VALUE = "none";
  public static ADD_ATTRIBUTE_STANDARD_VALUE = "standard";
  public static ADD_ATTRIBUTE_CUSTOM_VALUE = "custom";

  public static ENTITY_TYPE_ARRAY_VALUE = "array";
  public static ENTITY_TYPE_OBJECT_VALUE = "object";

  public static  ENTITY_ATTRIBUTE_TYPE_STRING_VALUE = "string";
  public static  ENTITY_ATTRIBUTE_TYPE_NUMBER_VALUE = "number";
  public static  ENTITY_ATTRIBUTE_TYPE_INTEGER_VALUE = "integer";
  public static  ENTITY_ATTRIBUTE_TYPE_BOOLEAN_VALUE = "boolean";

  public static mapAttributeDataType(name: string): string {
    let value = 'String';
    if (name === 'birthdate' || name === 'updated_at') {
      value = 'Datetime';
    }
    return value;
  }

  constructor(public generator: Base) {
  }

  public async askForServiceBaseName(configValue: string | undefined): Promise<Generator.Answers> {
    const defaultBaseName = configValue ? configValue : this.generator.getDefaultBaseName();
    return configValue === undefined ? this.generator.prompt([{
      default: defaultBaseName,
      message: 'What is the name of your service?',
      name: 'baseName',
      type: 'input',
      validate: (input: string) => {
        if (!/^([a-zA-Z0-9_-]*)$/.test(input)) {
          return 'Your base name cannot contain special characters or a blank space';
        }
        return true;
      }
    }]) : { baseName : configValue };
  }

  public async askForEntityType(configValue: string | undefined): Promise<Generator.Answers> {
    return configValue === undefined ? this.generator.prompt([{
      choices: [
        {name: 'Object', value: Prompt.ENTITY_TYPE_OBJECT_VALUE},
        {name: 'Array', value: Prompt.ENTITY_TYPE_ARRAY_VALUE},
      ],
      message: `${chalk.red('Schema')} - Which kind of entity do you want?`,
      name: 'type',
      type: 'list',
    }]) : { type: configValue };
  }

  public async askForLinkedEntityName(entities: IEntitySchema[] | undefined): Promise<Generator.Answers> {
    const entityChoices : any = [];
    if(entities) {
      entities.forEach((entity: IEntitySchema) => {
        entityChoices.push({name: entity.nameCamelCase, value: entity.nameCamelCase});
      });
    }
    return this.generator.prompt([{
      choices: entityChoices,
      message: `${chalk.red('Schema')} - Which entity would you link to linked?`,
      name: 'linkedEntityName',
      type: 'list',
    }]);
  }

  public async askForEntitySchema(): Promise<IEntitySchema> {
    let answerAddAttribute = await this.askForAddAttribute();
    const entityAttributes : IAttributeSchema[] = [];
    if(answerAddAttribute && answerAddAttribute.addAttribute) {
      while(answerAddAttribute && answerAddAttribute.addAttribute) {
        let entityAttribute : IAttributeSchema = {};
        const answerName = await this.askForEntityAttributeParameterName();
        // 2. Choose parameter type ()
        let answerAttributeDataType: Generator.Answers = {};
        answerAttributeDataType = await this.askForEntityAttributeDataType();
        // 4. Choose required value
        const answerRequired = await this.askForRequired();
        // 5. Attribute constraint
        let answerConstraint = {};
        if(answerAttributeDataType && answerAttributeDataType.attributeDataType && answerAttributeDataType.attributeDataType === 'Number') {
          const answerAddConstraint = await this.askForNumberConstraint();
          if(answerAddConstraint && answerAddConstraint.addConstraint) {
            answerConstraint = {
              numberAttributeConstraints: {
                ...await this.askForMaxValue(),
                ...await this.askForMinValue(),
              },
            }
          }
        } else if(answerAttributeDataType && answerAttributeDataType.attributeDataType && answerAttributeDataType.attributeDataType === 'String') {
          const answerAddConstraint = await this.askForStringConstraint();
          if(answerAddConstraint && answerAddConstraint.addConstraint) {
            answerConstraint = {
              stringAttributeConstraints: {
                ...await this.askForMaxLength(),
                ...await this.askForMinLength(),
              },
            }
          }
        }

        entityAttribute = {
          ...answerName,
          ...answerAttributeDataType,
          ...answerRequired,
          ...answerConstraint,
        };
        // Then add it to schema
        entityAttributes.push(entityAttribute);

        // Display current user schemas
        if(entityAttributes) {
          this.generator.log(`\nYour entity schema contains those attributes: ${this.displayEntitySchema(entityAttributes)}`);
        }

        // Finally, ask for a new attribute
        answerAddAttribute = await this.askForAddAttribute();
      }
    }
    return {
      attributes: entityAttributes,
    };
  }

  public async askForEntityAttributeDataType(): Promise<Generator.Answers> {
    return this.generator.prompt([{
      choices: [
        {name: 'String', value: Prompt.ENTITY_ATTRIBUTE_TYPE_STRING_VALUE},
        {name: 'Number', value: Prompt.ENTITY_ATTRIBUTE_TYPE_NUMBER_VALUE},
        {name: 'Integer', value: Prompt.ENTITY_ATTRIBUTE_TYPE_INTEGER_VALUE},
        {name: 'Boolean', value: Prompt.ENTITY_ATTRIBUTE_TYPE_BOOLEAN_VALUE},
      ],
      message: `${chalk.red('Schema')} - What is the type of your attribute?`,
      name: 'attributeDataType',
      type: 'list',
    }]);
  }

  public async askForEntityAttributeParameterName(): Promise<Generator.Answers> {
    return this.generator.prompt([{
      message: `${chalk.red('Schema')} - What is the name of your attribute?`,
      name: 'name',
      type: 'input',
      validate: (input: string) => {
        if (!/[\w-:]{0,20}/.test(input)) {
          return 'Your attribute name is not valid.';
        }
        return true;
      }
    }]);
  }

  public async askForEntityName(configValue: string | undefined, entities: IEntitySchema[] | undefined): Promise<Generator.Answers> {
    return configValue === undefined ? this.generator.prompt([{
      message: `${chalk.red('Schema')} - What is the name of your entity?`,
      name: 'name',
      type: 'input',
      validate: (input: string) => {
        if (!/[a-z]{0,20}/.test(input)) {
          return 'Your entity name is not valid.';
        } else if(this.checkEntityExist(input, entities)) {
          return `Your entity already exist, please choose an other name. To update an existing entity, please use ${chalk.red('daswag update')} command`
        }
        return true;
      }
    }]) : { name : configValue };
  }

  public async askForMinLength(): Promise<Generator.Answers> {
    return this.generator.prompt([{
      message: `${chalk.red('Schema')} - What is the min length of your attribute?`,
      name: 'minLength',
      type: 'input',
      validate: (input: string) => {
        if (!/[\d]+/.test(input)) {
          return 'Your min length value is not valid.';
        }
        return true;
      }
    }]);
  }

  public async askForMaxLength(): Promise<Generator.Answers> {
    return this.generator.prompt([{
      message: `${chalk.red('Schema')} - What is the max length of your attribute?`,
      name: 'maxLength',
      type: 'input',
      validate: (input: string) => {
        if (!/[\d]+/.test(input)) {
          return 'Your max length value is not valid.';
        }
        return true;
      }
    }]);
  }

  public async askForMaxValue(): Promise<Generator.Answers> {
    return this.generator.prompt([{
      message: `${chalk.red('Schema')} - What is the max value of your attribute?`,
      name: 'maxValue',
      type: 'input',
      validate: (input: string) => {
        if (!/[\d]+/.test(input)) {
          return 'Your max value value is not valid.';
        }
        return true;
      }
    }]);
  }

  public async askForMinValue(): Promise<Generator.Answers> {
    return this.generator.prompt([{
      message: `${chalk.red('Schema')} - What is the min value of your attribute?`,
      name: 'minValue',
      type: 'input',
      validate: (input: string) => {
        if (!/[\d]+/.test(input)) {
          return 'Your min value value is not valid.';
        }
        return true;
      }
    }]);
  }

  public async askForNumberConstraint(): Promise<Generator.Answers> {
    return this.generator.prompt([ {
      default: false,
      message: `${chalk.red('Schema')} - Do you want to add a constraint on your Number attribute (minvalue, maxvalue)?`,
      name: 'addConstraint',
      type: 'confirm',
    }]);
  }

  public async askForStringConstraint(): Promise<Generator.Answers> {
    return this.generator.prompt([ {
      default: false,
      message: `${chalk.red('Schema')} - Do you want to add a constraint on your String attribute (minlength, maxlength)?`,
      name: 'addConstraint',
      type: 'confirm',
    }]);
  }

  public async askForMutable(): Promise<Generator.Answers> {
    return this.generator.prompt([ {
      message: `${chalk.red('Schema')} - Do you want to make this attribute mutable?`,
      name: 'mutable',
      type: 'confirm',
    }]);
  }

  public async askForRequired(): Promise<Generator.Answers> {
    return this.generator.prompt([ {
      message: `${chalk.red('Schema')} - Do you want to make this attribute required?`,
      name: 'required',
      type: 'confirm',
    }]);
  }

  public async askForAddAttribute(): Promise<Generator.Answers> {
    return this.generator.prompt([ {
      message: `${chalk.red('Schema')} - Do you want to add an attribute to your entity?`,
      name: 'addAttribute',
      type: 'confirm',
    }]);
  }

  public displayEntities(entities: IEntitySchema[]) {
    let displayValues = entities.length > 0 ? '' : 'None';
    entities.forEach((value: IEntitySchema) => {
      displayValues += value.name +  ' ';
    });
    return displayValues;
  }

  private displayEntitySchema(schemasValues: IAttributeSchema[]) {
    let displayValues = schemasValues.length > 0 ? '' : 'None';
    schemasValues.forEach((value: IAttributeSchema) => {
      displayValues += value.name +  ' ';
    });
    return displayValues;
  }


  private checkEntityExist(entityName: string, entities: IEntitySchema[] | undefined) {
    let exist = false;
    if(entities) {
      entities.forEach((entity: IEntitySchema) => {
        if(entity.name && entity.name.toUpperCase() === entityName.toUpperCase()) {
          exist = true;
        }
      });
    }
    return exist;
  }
}
