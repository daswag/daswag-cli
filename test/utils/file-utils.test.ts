import {expect} from 'chai';
import * as fse from 'fs-extra';
import 'mocha';
import * as path from 'path';
import FileUtils from '../../src/utils/file-utils';

describe('file-utils', () => {
  it('should verify that a file exists', () => {
    const exists = FileUtils.doesFileExist(path.join(__dirname, '../../package.json'));
    expect(exists).to.equal(true);;
  });
  it('should verify that a file does not exist', () => {
    const exists = FileUtils.doesFileExist(path.join(__dirname, '../../test.json'));
    expect(exists).to.equal(false);;
  });
  it('should verify that a directory exist', () => {
    const exists = FileUtils.doesDirectoryExist(path.join(__dirname, '../../src'));
    expect(exists).to.equal(true);;
  });
  it('should verify that a directory does not exist', () => {
    const exists = FileUtils.doesDirectoryExist(path.join(__dirname, '../../test.json'));
    expect(exists).to.equal(false);;
  });
  it('should create a new directory', () => {
    FileUtils.createDirectory(path.join(__dirname, '../../test-dir'));
    expect(FileUtils.doesDirectoryExist(path.join(__dirname, '../../test-dir'))).to.equal(true);;
    fse.remove(path.join(__dirname, '../../test-dir'));
  });
  it('should not create a new directory when given directory is empty', () => {
    expect(() => {
      FileUtils.createDirectory('')
    }).to.throw(Error)
  });
  it('should not create a new directory when given directory is a file', () => {
    expect(() => {
      FileUtils.createDirectory(path.join(__dirname, '../../package.json'))
    }).to.throw(Error)
  });

});
