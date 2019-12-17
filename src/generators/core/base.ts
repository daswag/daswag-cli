import * as Path from 'path';
import * as Generator from 'yeoman-generator';
import LoggerUtils from '../../utils/logger-utils';

import chalk from "chalk";
import * as filter from 'gulp-filter';
import * as prettier from 'prettier';
import through = require("through2");
import CheckUtils from "../../utils/check-utils";
import {IOptions} from "../model/options.model";
import {Prompt} from "./prompt";
import Utils from "../../utils/utils";

export abstract class Base extends Generator {

  public logger = LoggerUtils.createLogger(this.loggerName());

  private prettierOptions = {
    arrowParens: 'avoid',
    jsxBracketSameLine: false,
    printWidth: 140,
    singleQuote: true,
    tabWidth: 2,
    useTabs: false,
  };

  public abstract loggerName() : string;

  /**
   * @returns default base name
   */
  public getDefaultBaseName() {
    return /^[a-zA-Z0-9_-]+$/.test(Path.basename(process.cwd())) ? Path.basename(process.cwd()) : 'daswag';
  }

  /**
   * Map Common options to his object
   * @param options
   */
  public mapCommonOpts(options: any) {
    return {
      iac: options.iac,
      entities: options.entities,
      provider: options.provider,
    }
  }

  public checkCommonDependencies(opts: IOptions) {
    this.log(`${chalk.blueBright('Checking Git: ')} ${CheckUtils.checkGit() ? chalk.green.bold('OK') : chalk.red.bold('KO')}`);
    if (opts.provider === Prompt.PROVIDER_AWS_VALUE) {
      this.log(`${chalk.blueBright('Checking AWS: ')} ${CheckUtils.checkAWS() ? chalk.green.bold('OK') : chalk.red.bold('KO')}`);
    }
    if (opts.iac === Prompt.IAC_SAM_VALUE) {
      this.log(`${chalk.blueBright('Checking AWS SAM: ')} ${CheckUtils.checkSAM() ? chalk.green.bold('OK') : chalk.red.bold('KO')}`);
    }
  }

  public setCommonConfig(opts: IOptions) {
    this.config.set('baseName', opts.baseName);
    this.config.set('baseNameCamelCase', opts.baseNameCamelCase);
    this.config.set('baseNameKebabCase', opts.baseNameKebabCase);
    this.config.set('provider', opts.provider);
    this.config.set('iac', opts.iac);
    this.config.set('entities', opts.entities);
    this.config.set('version',Utils.getVersion());
  }

  public getCommonConfig(opts: IOptions): IOptions {
    return {
      baseName: opts.baseName ? opts.baseName : this.config.get('baseName'),
      baseNameCamelCase: opts.baseNameCamelCase ? opts.baseNameCamelCase : this.config.get('baseNameCamelCase'),
      baseNameKebabCase: opts.baseNameKebabCase ? opts.baseNameKebabCase : this.config.get('baseNameKebabCase'),
      iac: opts.iac ? opts.iac : this.config.get('iac'),
      provider: opts.provider ? opts.provider : this.config.get('provider'),
      entities: opts.entities ? opts.entities : this.config.get('entities'),
    };
  }

  /**
   * Register beautify as transform stream for beautifying files during generation
   */
  public registerPrettierTransform() {
    // Prettier is clever, it uses correct rules and correct parser according to file extension.
    const prettierFilter = filter(['{,**/}*.{md,scss,css,json,yml,yaml}'], { restore: true });
    // this pipe will pass through (restore) anything that doesn't match typescriptFilter
    this.registerTransformStream([prettierFilter, this.prettierTransform(this.prettierOptions), prettierFilter.restore]);
  }

  private prettierTransform(defaultOptions: any) {
    const transform = (file: any, encoding: any, callback: any) => {
      /* resolve from the projects config */
      prettier.resolveConfig(file.relative).then(options => {
        if (file.state !== 'deleted') {
          const str = file.contents.toString();
          if (!options || Object.keys(options).length === 0) {
            options = defaultOptions;
          }
          // for better errors
          if(options) {
            options.filepath = file.relative;
            const data = prettier.format(str, options);
            file.contents = Buffer.from(data);
          }
        }
        callback(null, file);
      });
    };
    return through.obj(transform);
  }

}
