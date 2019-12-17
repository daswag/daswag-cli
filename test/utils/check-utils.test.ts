import {expect} from 'chai';
import 'mocha';
import sinon = require('sinon');
import CheckUtils from '../../src/utils/check-utils';

const proc = require('child_process');

describe('check-utils', () => {
  beforeEach(() => {
    sinon.stub(proc, 'execSync').returns({}); // no need to apply special logic here
  });
  afterEach(() => {
    proc.execSync.restore();
  });
  it('should check that Git has been installed', () => {
    expect(CheckUtils.checkGit()).to.be.true;
  });
  it('should check that Git has not been installed', () => {
    proc.execSync.throws(new Error(''));
    expect(CheckUtils.checkGit()).to.be.false;
  });
  it('should check that Serverless has been installed', () => {
    expect(CheckUtils.checkServerless()).to.be.true;
  });
  it('should check that Serverless has not been installed', () => {
    proc.execSync.throws(new Error(''));
    expect(CheckUtils.checkServerless()).to.be.false;
  });
  it('should check that Pip has been installed', () => {
    expect(CheckUtils.checkPip()).to.be.true;
  });
  it('should check that Pip has not been installed', () => {
    proc.execSync.throws(new Error(''));
    expect(CheckUtils.checkPip()).to.be.false;
  });
  it('should check that Python has been installed', () => {
    expect(CheckUtils.checkPython()).to.be.true;
  });
  it('should check that Python has not been installed', () => {
    proc.execSync.throws(new Error(''));
    expect(CheckUtils.checkPython()).to.be.false;
  });
  it('should check that Npm has been installed', () => {
    expect(CheckUtils.checkNpm()).to.be.true;
  });
  it('should check that Npm has not been installed', () => {
    proc.execSync.throws(new Error(''));
    expect(CheckUtils.checkNpm()).to.be.false;
  });
  it('should check that Yarn has been installed', () => {
    expect(CheckUtils.checkYarn()).to.be.true;
  });
  it('should check that Yarn has not been installed', () => {
    proc.execSync.throws(new Error(''));
    expect(CheckUtils.checkYarn()).to.be.false;
  });
  it('should check that SAM has been installed', () => {
    expect(CheckUtils.checkSAM()).to.be.true;
  });
  it('should check that SAM has not been installed', () => {
    proc.execSync.throws(new Error(''));
    expect(CheckUtils.checkSAM()).to.be.false;
  });
  it('should check that Terraform has been installed', () => {
    expect(CheckUtils.checkTerraform()).to.be.true;
  });
  it('should check that Terraform has not been installed', () => {
    proc.execSync.throws(new Error(''));
    expect(CheckUtils.checkTerraform()).to.be.false;
  });
  it('should check that AWS has been installed', () => {
    expect(CheckUtils.checkAWS()).to.be.true;
  });
  it('should check that AWS has not been installed', () => {
    proc.execSync.throws(new Error(''));
    expect(CheckUtils.checkAWS()).to.be.false;
  });
});
