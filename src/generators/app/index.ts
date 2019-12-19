import chalk from "chalk";
import * as changeCase from "change-case";
import {Base} from '../core/base';
import {IAppOptions} from "../model/app-options.model";
import UserMgmt = require("../services/user-mgmt");
import {AppPrompts} from "./app-prompts";

/**
 * Generator used to create a new project.
 */
class App extends Base {

  public static GENERATOR_TYPE = 'App';

  private opts: IAppOptions;
  private readonly skipChecks: boolean;
  private rootAppName: string;

  constructor(args: string | string[], options: any) {
    super(args, options);
    this.skipChecks = options.skipChecks;
    this.rootAppName = options.rootAppName;
    this.opts = {
      ...this.mapCommonOpts(options),
      baseName: '',
      baseNameCamelCase: '',
      baseNameKebabCase: '',
      services: options.services,
    };
    this.registerPrettierTransform()
  }

  public loggerName(): string {
    return "generator:app";
  }

  public async initializing() {
    this.logger.debug('Initializing phase start');
  }

  public async prompting() {
    this.logger.debug('Prompting phase start');
    // Get default prompts
    const prompt = new AppPrompts(this);

    const answerComponents = await prompt.askForServices(this.opts.services) as any;

    const answerRootAppName = await prompt.askForAppBaseName(this.rootAppName) as any;
    if (answerRootAppName && answerRootAppName.rootAppName) {
      this.rootAppName = answerRootAppName.rootAppName;
    }

    const answerProvider = await prompt.askForCloudProviders(this.opts.provider) as any;
    const answerIac = await prompt.askForInfraAsCode(this.opts.iac) as any;

    // Combine answers
    this.opts = {
      ...this.opts,
      ...answerComponents,
      ...answerRootAppName,
      ...answerProvider,
      ...answerIac,
    };
  }

  public async configuring() {
    this.logger.debug('Configuring phase start');

    // We are creating a new project, we need to init the user management system first if needed
    if (this.opts.services.includes(UserMgmt.GENERATOR_TYPE)) {
      this.composeWith(require.resolve('../services/' + changeCase.paramCase(UserMgmt.GENERATOR_TYPE)), {
        ...this.opts,
        rootPath: this.destinationRoot(),
        rootAppName: this.rootAppName,
        skipChecks: this.skipChecks,
        skipCommonInit: true,
      });
    }

    // Then launched other services generators depending on prompt values
    this.opts.services.forEach((service: string) => {
      // Combine with given generator
      if(service !== UserMgmt.GENERATOR_TYPE) {
        this.composeWith(require.resolve('../services/' + service), {
          ...this.opts,
          rootPath: this.destinationRoot(),
          rootAppName: this.rootAppName,
          skipChecks: this.skipChecks,
          skipCommonInit: true,
        });
      }
    });
  }

  public default() {
    this.logger.debug('Default phase start');
  }

  public writing() {
    this.logger.debug('Writing phase start');
  }

  public install() {
    this.logger.debug('Installing phase start');
  }

  public end() {
    this.logger.debug('Ending phase start');
    this.log(chalk.green(`Your project has been generated successfully. You are now ready to develop.`));
  }
}

export = App
