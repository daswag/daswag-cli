import chalk from "chalk";
import * as changeCase from "change-case";
import * as path from "path";
import ConfigUtils from "../../../utils/config-utils";
import Utils from "../../../utils/utils";
import {Base} from '../../core/base';
import {IUserMgmtOptions} from "../../model/user-mgmt-options.model";
import {UserMgmtFiles} from "./user-mgmt-files";
import {UserMgmtPrompts} from "./user-mgmt-prompts";

/**
 * Generator used to create a new project.
 */
class UserMgmt extends Base {

  public static GENERATOR_TYPE = 'UserMgmt';

  private opts: IUserMgmtOptions;

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
      aliasAttributes: options.aliasAttributes,
      baseName: options.baseName ? options.baseName : options.rootAppName,
      baseNameCamelCase: options.baseName ? changeCase.pascalCase(options.baseName) : Utils.formatBaseName(options.rootAppName, UserMgmt.GENERATOR_TYPE),
      baseNameKebabCase: changeCase.paramCase(options.baseName ? options.baseName : Utils.formatBaseName(options.rootAppName, UserMgmt.GENERATOR_TYPE)),
      replyToEmailAddress: options.replyToEmailAddress,
      system: options.system,
      userDataStorage: options.userDataStorage,
      usernameAttributes: options.usernameAttributes,
      userSchemas: options.userSchemas,
      userSignIn: options.userSignIn,
      userSignUp: options.userSignUp,
      verifiedAttributes: options.verifiedAttributes,
    };
    this.registerPrettierTransform()
  }

  public loggerName(): string {
    return 'generator:user-mgmt';
  }

  public async initializing() {
    this.logger.debug('Initializing phase start');
    this.opts = ConfigUtils.getUserMgmtConfig(this.opts, this);
  }

  public async prompting() {
    this.logger.debug('Prompting phase start');
    // Get default prompts
    const prompt = new UserMgmtPrompts(this);
    let answerBaseName = await prompt.askForServiceBaseName(this.opts.baseName) as any;
    if (!this.opts.baseName && answerBaseName && answerBaseName.baseName) {
      answerBaseName = {
        baseName: answerBaseName.baseName,
        baseNameCamelCase: changeCase.pascalCase(answerBaseName.baseName),
        baseNameKebabCase: changeCase.paramCase(answerBaseName.baseName),
      }
    }

    const answerSystem = await prompt.askForSystem(this.opts.system) as any;
    const answerUserDataStorage = await prompt.askForUserDataStorage(this.opts.userDataStorage) as any;
    const answerUserSignUp = await prompt.askForUserSignUp(this.opts.userSignUp) as any;
    const answerVerifiedAttributes = await prompt.askForVerifiedAttributes(this.opts.verifiedAttributes) as any;
    let answerReplyToEmailAddress = {};
    if (answerVerifiedAttributes && answerVerifiedAttributes.verifiedAttributes && answerVerifiedAttributes.verifiedAttributes.includes(UserMgmtPrompts.VERIFIED_ATTRIBUTE_EMAIL_VALUE)) {
      answerReplyToEmailAddress = await prompt.askForReplyToEmailAddress(this.opts.replyToEmailAddress);
    }

    const answerUserSignIn = await prompt.askForUserSignIn(this.opts.userSignIn) as any;
    let answerAliasAttributes = {};
    let answerUsernameAttributes = {};
    if(answerUserSignIn && answerUserSignIn.userSignIn && answerUserSignIn.userSignIn === UserMgmtPrompts.USER_SIGN_IN_USERNAME_VALUE) {
      answerAliasAttributes = await prompt.askForAliasAttributes(this.opts.aliasAttributes) as any;
    } else {
      answerUsernameAttributes = await prompt.askForUsernameAttributes(this.opts.usernameAttributes) as any;
    }

    this.log(`We will now build your ${chalk.red('User')} schema.`);
    const answerUserSchemas = await prompt.askForUserSchemas(this.opts.userSchemas);

    // Combine answers
    this.opts = {
      ...this.opts,
      ...answerBaseName,
      ...answerAliasAttributes,
      ...answerReplyToEmailAddress,
      ...answerSystem,
      ...answerUserDataStorage,
      ...answerUsernameAttributes,
      ...answerUserSignIn,
      ...answerUserSignUp,
      ...answerVerifiedAttributes,
      ...answerUserSchemas,
    };
  }

  public async configuring() {
    this.logger.debug('Configuring phase start');

    if (!this.skipChecks) {
      this.log(`${chalk.red('UserMgmt')} - ${chalk.blueBright('We are now checking your environment:')}`);

      // Checking all needed dependencies
      if(!this.skipCommonInit) {
        this.checkCommonDependencies(this.opts);
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

    // UserMgmt Specific
    this.config.set('type', UserMgmt.GENERATOR_TYPE);
    this.config.set('aliasAttributes', this.opts.aliasAttributes);
    this.config.set('system', this.opts.system);
    this.config.set('userDataStorage', this.opts.userDataStorage);
    this.config.set('userSignUp', this.opts.userSignUp);
    this.config.set('userSignIn', this.opts.userSignIn);
    this.config.set('usernameAttributes', this.opts.usernameAttributes);
    this.config.set('verifiedAttributes', this.opts.verifiedAttributes);
    this.config.set('replyToEmailAddress', this.opts.replyToEmailAddress);
    this.config.set('userSchemas', this.opts.userSchemas);
    this.config.save();
  }

  public writing() {
    this.logger.debug('Writing phase start');
    // Copy files
    new UserMgmtFiles(this, this.opts).writeFiles();
  }

  public install() {
    this.logger.debug('Installing phase start');
  }

  public end() {
    this.logger.debug('Ending phase start');
    this.log(chalk.green(`Your ${chalk.red('User Management system')} has been generated successfully.`));
  }
}

export = UserMgmt
