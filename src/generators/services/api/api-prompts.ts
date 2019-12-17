import chalk from 'chalk';
import * as Generator from "yeoman-generator";
import { Prompt } from '../../core/prompt';

export class ApiPrompts extends Prompt  {

  public static LANGUAGE_PYTHON37_VALUE = 'python37';
  public static DB_DYNAMODB_VALUE = 'dynamodb';

  public async askForLanguage(configValue: string | undefined): Promise<Generator.Answers> {
    return configValue === undefined ? this.generator.prompt([{
      choices: [
        {name: 'Python 3.7', value:ApiPrompts.LANGUAGE_PYTHON37_VALUE},
      ],
      default: ApiPrompts.LANGUAGE_PYTHON37_VALUE,
      message: `${chalk.red('Api')} - Which ${chalk.yellow('*Language*')} would you like to use?`,
      name: 'language',
      type: 'list',
    }]) : { language : configValue };
  }

  public async askForDB(configValue: string | undefined): Promise<Generator.Answers> {
    return configValue === undefined ? this.generator.prompt([ {
      choices: [
        {name: 'NoSQL - DynamoDB', value:ApiPrompts.DB_DYNAMODB_VALUE},
      ],
      default: ApiPrompts.DB_DYNAMODB_VALUE,
      message: `${chalk.red('Api')} - Which ${chalk.yellow('*Database*')} would you like to use?`,
      name: 'db',
      type: 'list',
    }]) : { db : configValue };
  }
}
