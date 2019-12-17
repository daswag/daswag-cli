import * as Env from "yeoman-environment";
import CommandBase from './command-base';

import chalk from "chalk";
import * as changeCase from "change-case";
import * as fs from "fs";
import * as path from "path";
import pjson = require('pjson');

export abstract class GeneratorBase extends CommandBase {

  public static YEOMAN_CONFIG_FILE = '.yo-rc.json';

  protected init(): Promise<any> {
    this.printLogo();
    return super.init();
  }

  protected validate(options: object): boolean {
    return true;
  }

  protected checkWorkspace(type: string) {
    const configType: string = this.getWorkspaceType();
    if (!configType) {
      this.log(`This command can only be called inside a daSWAG project folder.\n`);
      this.exit(1);
    } else if(configType !== type) {
      this.log(`This command can only be called inside a daSWAG ${chalk.red(type)} project type.\n`);
      this.exit(1);
    }
  }

  protected isWorkspace(): boolean {
    const destinationConfigFile = path.join('./', GeneratorBase.YEOMAN_CONFIG_FILE);
    return fs.existsSync(destinationConfigFile);
  }

  protected getWorkspaceType(): string {
    // Check that we are on a daSWAG folder
    const destinationConfigFile = path.join('./', GeneratorBase.YEOMAN_CONFIG_FILE);
    if(!fs.existsSync(destinationConfigFile)) {
      this.log(`This command can only be called inside a daswag directory.\n`)
      this.exit(1);
    }
    const configFile = fs.readFileSync(path.join('./', GeneratorBase.YEOMAN_CONFIG_FILE), 'utf8');
    const config = JSON.parse(configFile);
    return config['daswag-cli'] ? config['daswag-cli'].type : '';
  }

  protected async generate(type: string, name: string, generatorOptions: object = {}) {
    const env = Env.createEnv();

    await env.register(
      require.resolve(`./generators/${type}/${changeCase.paramCase(name)}`),
      `daswag:${name}`,
    );

    await new Promise((resolve, reject) => {
      env.run(`daswag:${name}`, generatorOptions, (err: null | Error) => {
        if (err) {
          this.log(err.message);
          reject(err);
        } else {
          resolve()
        }
      });
    });
  }

  private printLogo() {
    this.log('\n');
    this.log(`${chalk.black('██████╗  █████╗ ')}${chalk.blueBright('███████╗██╗    ██╗ █████╗  ██████╗ ')}`);
    this.log(`${chalk.black('██╔══██╗██╔══██╗')}${chalk.blueBright('██╔════╝██║    ██║██╔══██╗██╔════╝ ')}`);
    this.log(`${chalk.black('██║  ██║███████║')}${chalk.blueBright('███████╗██║ █╗ ██║███████║██║  ███╗')}`);
    this.log(`${chalk.black('██║  ██║██╔══██║')}${chalk.blueBright('╚════██║██║███╗██║██╔══██║██║   ██║')}`);
    this.log(`${chalk.black('██████╔╝██║  ██║')}${chalk.blueBright('███████║╚███╔███╔╝██║  ██║╚██████╔╝')}`);
    this.log(`${chalk.black('╚═════╝ ╚═╝  ╚═╝')}${chalk.blueBright('╚══════╝ ╚══╝╚══╝ ╚═╝  ╚═╝ ╚═════╝ ')}`);
    this.log(chalk.white.bold('           https://www.daswag.tech\n'));
    this.log(chalk.white('Welcome to daSWAG ') + chalk.yellow(`v${pjson.version}`));
    this.log(chalk.white(`Application files will be generated in folder: ${chalk.yellow(process.cwd())}`));
    if (process.cwd() === this.getUserHome()) {
      this.log(chalk.red.bold('\n️⚠️  WARNING ⚠️  You are in your HOME folder!'));
      this.log(
        chalk.red('This can cause problems, you should always create a new directory and run the daswag command from here.')
      );
      this.log(chalk.white(`See the troubleshooting section at ${chalk.yellow('https://www.daswag.tech/documentation/installation/')}`));
    }
    this.log(
      chalk.blueBright(
        '_______________________________________________________________________________________________________________\n'
      )
    );
    this.log(
      chalk.white(`  Documentation for creating a Serverless application is at ${chalk.yellow('https://www.daswag.tech/documentation/installation/getting-started/')}`)
    );
    this.log(
      chalk.blueBright(
        '_______________________________________________________________________________________________________________\n'
      )
    );
  }
}
