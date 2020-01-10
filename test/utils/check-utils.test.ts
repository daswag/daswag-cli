import {expect} from 'chai';
import 'mocha';
import sinon = require('sinon');
import CheckUtils from '../../src/utils/check-utils';

// tslint:disable-next-line:no-var-requires
const proc = require('child_process');

describe('check-utils', () => {
  beforeEach(() => {
    sinon.stub(proc, 'execSync').returns({}); // no need to apply special logic here
  });
  afterEach(() => {
    proc.execSync.restore();
  });
  it('should check that Git has been installed', () => {
    expect(CheckUtils.checkGit()).to.equal(true);
  });
  it('should check that Git has not been installed', () => {
    proc.execSync.throws(new Error(''));
    expect(CheckUtils.checkGit()).to.equal(false);
  });
  it('should check that Serverless has been installed', () => {
    expect(CheckUtils.checkServerless()).to.equal(true);
  });
  it('should check that Serverless has not been installed', () => {
    proc.execSync.throws(new Error(''));
    expect(CheckUtils.checkServerless()).to.equal(false);
  });
  it('should check that Amplify CLI has been installed', () => {
    expect(CheckUtils.checkAmplifyCli()).to.equal(true);
  });
  it('should check that Amplify CLI has not been installed', () => {
    proc.execSync.throws(new Error(''));
    expect(CheckUtils.checkAmplifyCli()).to.equal(false);
  });
  it('should check that Pip has been installed', () => {
    expect(CheckUtils.checkPip()).to.equal(true);
  });
  it('should check that Pip has not been installed', () => {
    proc.execSync.throws(new Error(''));
    expect(CheckUtils.checkPip()).to.equal(false);;
  });
  it('should check that Python has been installed', () => {
    expect(CheckUtils.checkPython()).to.equal(true);
  });
  it('should check that Python has not been installed', () => {
    proc.execSync.throws(new Error(''));
    expect(CheckUtils.checkPython()).to.equal(false);;
  });
  it('should check that Npm has been installed', () => {
    expect(CheckUtils.checkNpm()).to.equal(true);
  });
  it('should check that Npm has not been installed', () => {
    proc.execSync.throws(new Error(''));
    expect(CheckUtils.checkNpm()).to.equal(false);;
  });
  it('should check that Yarn has been installed', () => {
    expect(CheckUtils.checkYarn()).to.equal(true);;
  });
  it('should check that Yarn has not been installed', () => {
    proc.execSync.throws(new Error(''));
    expect(CheckUtils.checkYarn()).to.equal(false);;
  });
  it('should check that SAM has been installed', () => {
    expect(CheckUtils.checkSAM()).to.equal(true);;
  });
  it('should check that SAM has not been installed', () => {
    proc.execSync.throws(new Error(''));
    expect(CheckUtils.checkSAM()).to.equal(false);;
  });
  it('should check that Terraform has been installed', () => {
    expect(CheckUtils.checkTerraform()).to.equal(true);;
  });
  it('should check that Terraform has not been installed', () => {
    proc.execSync.throws(new Error(''));
    expect(CheckUtils.checkTerraform()).to.equal(false);;
  });
  it('should check that AWS has been installed', () => {
    expect(CheckUtils.checkAWS()).to.equal(true);;
  });
  it('should check that AWS has not been installed', () => {
    proc.execSync.throws(new Error(''));
    expect(CheckUtils.checkAWS()).to.equal(false);;
  });
});
