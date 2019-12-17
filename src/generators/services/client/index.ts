import chalk from 'chalk';
import * as changeCase from "change-case";
import * as path from "path";
import CheckUtils from '../../../utils/check-utils';
import ConfigUtils from "../../../utils/config-utils";
import Utils from "../../../utils/utils";
import {Base} from '../../core/base';
import {IClientOptions} from "../../model/client-options.model";
import {ClientFiles} from "./client-files";
import {ClientPrompts} from './client-prompts';

/**
 * Generator used to create a new client component.
 */
class Client extends Base {

  public static GENERATOR_TYPE = 'Client';

  private opts: IClientOptions;

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
      baseNameCamelCase: options.baseName ? changeCase.pascalCase(options.baseName) : Utils.formatBaseName(options.rootAppName, Client.GENERATOR_TYPE),
      baseNameKebabCase: changeCase.paramCase(options.baseName ? options.baseName : Utils.formatBaseName(options.rootAppName, Client.GENERATOR_TYPE)),
      clientTheme: options.clientTheme,
      framework: options.framework,
      packageManager: options.packageManager
    };
    this.registerPrettierTransform()
  }

  public loggerName(): string {
    return "generator:client";
  }

  public async initializing() {
    this.logger.debug('Initializing phase start');
    // Load from configuration file
    this.opts = ConfigUtils.getClientConfig(this.opts, this);
  }

  public async prompting() {
    this.logger.debug('Prompting phase start');
    // Get App prompts
    const prompt = new ClientPrompts(this);

    this.log(`Let's configure our ${chalk.red('Client')} service.`);
    let answerBaseName = await prompt.askForServiceBaseName(this.opts.baseName) as any;
    if (!this.opts.baseName && answerBaseName && answerBaseName.baseName) {
      answerBaseName = {
        baseName: answerBaseName.baseName,
        baseNameCamelCase: changeCase.pascalCase(answerBaseName.baseName),
        baseNameKebabCase: changeCase.paramCase(answerBaseName.baseName),
      }
    }

    // Client Specific
    const answerFramework = await prompt.askForFramework(this.opts.framework) as any;
    const answerPackageManager = await prompt.askForPackageManager(this.opts.packageManager) as any;
    const answerClientTheme = await prompt.askForClientTheme(this.opts.clientTheme) as any;

    // Combine answers
    this.opts = {
      ...this.opts,
      ...answerBaseName,
      ...answerFramework,
      ...answerPackageManager,
      ...answerClientTheme,
    };
  }

  public async configuring() {
    this.logger.debug('Configuring phase start');
    if (!this.skipChecks) {
      this.log(`${chalk.red('Client')} - ${chalk.blueBright('We are now checking your environment:')}`);
      // Checking all needed dependencies
      if(!this.skipCommonInit) {
        this.checkCommonDependencies(this.opts);
      }

      // Client specific dependencies
      if (this.opts.packageManager === ClientPrompts.PACKAGE_MANAGER_NPM_VALUE) {
        this.log(`${chalk.blueBright('Checking NPM: ')} ${CheckUtils.checkNpm() ? chalk.green.bold('OK') : chalk.red.bold('KO')}`);
      } else if (this.opts.packageManager === ClientPrompts.PACKAGE_MANAGER_YARN_VALUE) {
        this.log(`${chalk.blueBright('Checking Yarn: ')} ${CheckUtils.checkYarn() ? chalk.green.bold('OK') : chalk.red.bold('KO')}`);
      }
    }
  }

  public default() {
    this.logger.debug('Default phase start');
    if(this.opts.baseNameKebabCase && this.rootPath.indexOf(this.opts.baseNameKebabCase) === -1) {
      this.destinationRoot(path.join(this.rootPath, this.opts.baseNameKebabCase));
    }
    // Save Configuration to yeoman file (.yo-rc.json)
    // Common parts
    this.setCommonConfig(this.opts);

    // Client specific
    this.config.set('type', Client.GENERATOR_TYPE);
    this.config.set('clientTheme', this.opts.clientTheme);
    this.config.set('framework', this.opts.framework);
    this.config.set('packageManager', this.opts.packageManager);
    this.config.save();
  }

  public writing() {
    this.logger.debug('Writing phase start');
    // Copy files
    new ClientFiles(this, this.opts).writeFiles();
  }

  public install() {
    this.logger.debug('Installing phase start');
    this.log(`You can now install your dependencies by running: ${chalk.blueBright.bold(`make bootstrap`)}`);
  }

  public end() {
    this.logger.debug('Ending phase start');
    this.log(chalk.green(`Your ${chalk.red('Client')} has been generated successfully.`));
  }
}

export = Client
