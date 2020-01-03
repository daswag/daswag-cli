import {expect} from 'chai';
import 'mocha';
import Utils from "../../src/utils/utils";

describe('utils', () => {
  it('should not format an empty base name', () => {
    const value = Utils.formatBaseName('', 'App');
    expect(value).to.equal('');
  });
  it('should format \'Test\' to his corresponding application base name', () => {
    const value = Utils.formatBaseName('Test', 'App');
    expect(value).to.equal('TestApp');
  });
  it('should format \'TestApp\' to his corresponding application base name', () => {
    const value = Utils.formatBaseName('TestApp', 'App');
    expect(value).to.equal('TestApp');
  });
  it('should format \'testSampleClient\' to his corresponding client base name', () => {
    const value = Utils.formatBaseName('testSampleClient', 'Client');
    expect(value).to.equal('TestSampleClient');
  });
  it('should format \'testSample\' to his corresponding user mangement base name', () => {
    const value = Utils.formatBaseName('TestSample', 'User-Mgmt');
    expect(value).to.equal('TestSampleUserMgmt');
  });
  it('should validate the test@test.fr \'email\' address', () => {
    const value = Utils.isValidEmail('test@test.fr');
    expect(value).to.equal(true);
  });
  it('should validate the test.test@test.fr \'email\' address', () => {
    const value = Utils.isValidEmail('test.test@test.fr');
    expect(value).to.equal(true);
  });
  it('should not validate the test@test \'email\' address', () => {
    const value = Utils.isValidEmail('test@test');
    expect(value).to.equal(false);
  });
});
