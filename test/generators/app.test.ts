import * as fse from "fs-extra";
import * as path from 'path';
import assert = require("yeoman-assert");
import * as helpers from 'yeoman-test';
import {Base} from "../../src/generators/core/base";

describe('daswag:app', () => {
  context('generate an application', () => {
    describe('with all default parameters', () => {
      let generator: Base;
      const config = {
        services: ['Api', 'UserMgmt', 'Client'],
        rootAppName: 'TestApp',
        rootAppKebabCaseName: 'test-app',
        provider: 'aws',
        iac: 'sam'
      };
      const deps: any = [
        [helpers.createDummyGenerator(), 'karma:app']
      ];
      it('creates expected files for given configuration', () => {
        return helpers
          .run(path.join(__dirname, '../../src/generators/app'))
          .withGenerators(deps)
          .withOptions({})
          .withPrompts(config)
          .on('ready',  (gen) => {
            // This is called right before `generator.run()` is called
            generator = gen;
          })
          .then((tempDir) => {
            // Check that all generators have been called with good options and content has been generated
            assert.file(path.join(tempDir, config.rootAppKebabCaseName + '-client', '.yo-rc.json'));
            assert.file(path.join(tempDir, config.rootAppKebabCaseName + '-api', '.yo-rc.json'));
            assert.file(path.join(tempDir, config.rootAppKebabCaseName + '-user-mgmt', '.yo-rc.json'));
          });
      });
    });
  });
});


