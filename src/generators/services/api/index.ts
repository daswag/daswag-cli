import chalk from 'chalk';
import * as changeCase from "change-case";
import * as path from "path";
import CheckUtils from '../../../utils/check-utils';
import ConfigUtils from "../../../utils/config-utils";
import Utils from "../../../utils/utils";
import {Base} from '../../core/base';
import {IApiOptions} from "../../model/api-options.model";
import {ApiFiles} from "./api-files";
import {ApiPrompts} from './api-prompts';

/**
 * Generator used to create a new Api component.
 */
class Api extends Base {

  public static GENERATOR_TYPE = 'Api';

  private opts: IApiOptions;

  private readonly skipCommonInit: boolean;
  private readonly skipChecks: boolean;
  private readonly rootPath: string;

  constructor(args: string | string[], options: any) {
    super(args, options);
    this.skipCommonInit = options.skipCommonInit;
    this.skipChecks = options.skipChecks;
    this.rootPath = options.rootPath ? options.rootPath : this.destinationRoot();
    this.opts = {
      ...this.mapCommonOpts(options),
      baseName: options.baseName ? options.baseName : options.rootAppName,
      baseNameCamelCase: options.baseName ? changeCase.pascalCase(options.baseName) : Utils.formatBaseName(options.rootAppName, Api.GENERATOR_TYPE),
      baseNameKebabCase: changeCase.paramCase(options.baseName ? options.baseName : Utils.formatBaseName(options.rootAppName, Api.GENERATOR_TYPE)),
      db: options.db,
      language: options.language
    };
    this.registerPrettierTransform()
  }

  public loggerName(): string {
    return "generator:api";
  }

  public async initializing() {
    this.logger.debug('Initializing phase start');
    this.opts = ConfigUtils.getApiConfig(this.opts, this);
  }

  public async prompting() {
    this.logger.debug('Prompting phase start');
    // Get Api prompts
    const prompt = new ApiPrompts(this);

    this.log(`Let's configure our ${chalk.red('Api')} service.`);
    let answerBaseName = await prompt.askForServiceBaseName(this.opts.baseName) as any;
    if (!this.opts.baseName && answerBaseName && answerBaseName.baseName) {
      answerBaseName = {
        baseName: answerBaseName.baseName,
        baseNameCamelCase: changeCase.pascalCase(answerBaseName.baseName),
        baseNameKebabCase: changeCase.paramCase(answerBaseName.baseName),
      }
    }

    // Prompt API specific questions
    const answerLanguage = await prompt.askForLanguage(this.opts.language) as any;
    const answerDb = await prompt.askForDB(this.opts.db) as any;

    // Combine answers to options
    this.opts = {
      ...this.opts,
      ...answerBaseName,
      ...answerLanguage,
      ...answerDb,
    };
  }

  public async configuring() {
    this.logger.debug('Configuring phase start');
    if (!this.skipChecks) {
      this.log(`${chalk.red('Api')} - ${chalk.blueBright('We are now checking your environment:')}`);

      // Checking all needed dependencies
      if(!this.skipCommonInit) {
        this.checkCommonDependencies(this.opts);
      }

      // Checking Api Specific dependencies
      if (this.opts.language === ApiPrompts.LANGUAGE_PYTHON37_VALUE) {
        this.log(`${chalk.blueBright('Checking Python & Pip: ')} ${CheckUtils.checkPython() && CheckUtils.checkPip() ? chalk.green.bold('OK') : chalk.red.bold('KO')}`);
      }
    }
  }

  public default() {
    this.logger.debug('Default phase start');

    // Create destination folder
    if(this.opts.baseNameKebabCase && this.rootPath.indexOf(this.opts.baseNameKebabCase) === -1) {
      this.destinationRoot(path.join(this.rootPath, this.opts.baseNameKebabCase));
    }
    // Save Configuration to yeoman file (.yo-rc.json)
    // Common parts
    this.setCommonConfig(this.opts);

    // API Specific
    this.config.set('type', Api.GENERATOR_TYPE);
    this.config.set('language', this.opts.language);
    this.config.set('db', this.opts.db);

    this.config.save();
  }

  public writing() {
    this.logger.debug('Writing phase start');
    // Copy files to destination
    new ApiFiles(this, this.opts).writeFiles();
  }

  public install() {
    this.logger.debug('Installing phase start');
    this.log(`\nYou can now install your dependencies by running: ${chalk.blueBright.bold(`make bootstrap`)}`);
  }

  public end() {
    this.logger.debug('Ending phase start');
    this.log(chalk.green(`Your ${chalk.red('Api')} has been generated successfully.`));
  }
}

export = Api
