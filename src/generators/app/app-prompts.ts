import chalk from "chalk";
import * as changeCase from "change-case";
import * as path from "path";
import * as Generator from "yeoman-generator";
import FileUtils from "../../utils/file-utils";
import Utils from "../../utils/utils";
import {Prompt} from '../core/prompt';
import Api = require("../services/api");
import Client = require("../services/client");
import UserMgmt = require("../services/user-mgmt");

export class AppPrompts extends Prompt  {

  public async askForServices(configValue: string[] | undefined): Promise<Generator.Answers> {
    return configValue === undefined ? this.generator.prompt([{
      choices: [
        {name: 'An Api', value: Api.GENERATOR_TYPE},
        {name: 'A Web Client', value: Client.GENERATOR_TYPE},
        {name: 'An User Management system for authentication', value: UserMgmt.GENERATOR_TYPE},
      ],
      message: `${chalk.red('General')} - Which ${chalk.yellow('*Service*')} would you like to add to your application?`,
      name: 'services',
      type: 'checkbox',
    }]) : { services : configValue };
  }

  public async askForAppBaseName(configValue: string | undefined): Promise<Generator.Answers> {
    const defaultBaseName = this.generator.getDefaultBaseName();
    return configValue === undefined ? this.generator.prompt([{
      default: defaultBaseName,
      message: `${chalk.red('General')} - What is the name of your application?`,
      name: 'rootAppName',
      type: 'input',
      validate: (input: string) => {
        if (!/^([a-zA-Z0-9_-]*)$/.test(input)) {
          return 'Your base name cannot contain special characters or a blank space';
        } else if(FileUtils.doesFileExist(path.join(this.generator.destinationRoot(), changeCase.paramCase(Utils.formatBaseName(input, 'app')), '.yo-rc.json'))) {
          return 'A project already exist on this name.';
        }
        return true;
      }
    }]) : { rootAppName : configValue };
  }

  public async askForCloudProviders(configValue: string | undefined): Promise<Generator.Answers> {
    return configValue === undefined ? this.generator.prompt([ {
      choices: [{name: 'Amazon Web Services', value: Prompt.PROVIDER_AWS_VALUE}],
      default: Prompt.PROVIDER_AWS_VALUE,
      message: `${chalk.red('General')} - Which ${chalk.yellow('*Cloud Provider*')} do you want to use?`,
      name: 'provider',
      type: 'list',
    }]) : { provider : configValue };
  }

  public async askForInfraAsCode(configValue: string | undefined): Promise<Generator.Answers> {
    return configValue === undefined ? this.generator.prompt([ {
      choices: [
        {name: 'AWS SAM (Serverless Application Model)', value: Prompt.IAC_SAM_VALUE},
      ],
      default: Prompt.IAC_SAM_VALUE,
      message: `${chalk.red('General')} - Which ${chalk.yellow('*InfraAsCode*')} technology do you want to use?`,
      name: 'iac',
      type: 'list',
    }]) : { iac : configValue };
  }
}
