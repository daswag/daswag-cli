import {execSync} from 'child_process'
import LoggerUtils from './logger-utils';

export default class CheckUtils {

  public static checkGit() {
    let check = false;
    try {
      execSync('git --version', {stdio: 'ignore'})
      check = true
    } catch {
      this.logger.debug('Checking Git : KO');
    }
    return check;
  }

  public static checkSAM() {
    let check = false;
    try {
      execSync('sam --version', {stdio: 'ignore'})
      check = true
    } catch {
      this.logger.debug('Checking SAM : KO');
    }
    return check;
  }

  public static checkAmplifyCli() {
    let check = false;
    try {
      execSync('amplify --version', {stdio: 'ignore'})
      check = true
    } catch {
      this.logger.debug('Checking Amplify CLI : KO');
    }
    return check;
  }

  public static checkAWS() {
    let check = false;
    try {
      execSync('aws --version', {stdio: 'ignore'})
      check = true
    } catch {
      this.logger.debug('Checking AWSCli : KO');
    }
    return check;
  }

  public static checkTerraform() {
    let check = false;
    try {
      execSync('terraform --version', {stdio: 'ignore'})
      check = true
    } catch {
      this.logger.debug('Checking Terraform : KO');
    }
    return check;
  }

  public static checkServerless() {
    let check = false;
    try {
      execSync('serverless --version', {stdio: 'ignore'})
      check = true
    } catch {
      this.logger.debug('Checking Serverless : KO');
    }
    return check;
  }

  public static checkNpm() {
    let check = false;
    try {
      execSync('yarn -v', {stdio: 'ignore'})
      check = true
    } catch {
      this.logger.debug('Checking Npm : KO');
    }
    return check;
  }

  public static checkYarn() {
    let check = false;
    try {
      execSync('yarn -v', {stdio: 'ignore'})
      check = true
    } catch {
      this.logger.debug('Checking Yarn : KO');
    }
    return check;
  }

  public static checkPython() {
    let check = false;
    try {
      execSync('python3 -v', {stdio: 'ignore'})
      check = true
    } catch {
      this.logger.debug('Checking Python : KO');
    }
    return check;
  }

  public static checkPip() {
    let check = false;
    try {
      execSync('pip3 --version', {stdio: 'ignore'})
      check = true
    } catch {
      this.logger.debug('Checking Pip : KO');
    }
    return check;
  }

  private static logger = LoggerUtils.createLogger('CheckUtils');

}
