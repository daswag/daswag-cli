import * as fse from "fs-extra";
import * as path from 'path';
import * as assert from 'yeoman-assert';
import * as helpers from 'yeoman-test';
import {Base} from "../../src/generators/core/base";
import {Prompt} from '../../src/generators/core/prompt';
import {IClientOptions} from "../../src/generators/model/client-options.model";
import {ClientFiles} from "../../src/generators/services/client/client-files";
import {ClientPrompts} from '../../src/generators/services/client/client-prompts';
import {ConstantsUtils} from "../../src/utils/constants-utils";
import FileTools from "../tools/file-tools"

describe('daswag:client', () => {
  context('generate a client', () => {
    describe('with AWS, Angular and SAM parameters', () => {
      let generator: Base;
      const config : IClientOptions = {
        framework: ClientPrompts.FRAMEWORK_ANGULAR_VALUE,
        iac: Prompt.IAC_SAM_VALUE,
        packageManager: ClientPrompts.PACKAGE_MANAGER_YARN_VALUE,
        provider: Prompt.PROVIDER_AWS_VALUE
      };
      it('creates expected files for given configuration', () => {
        return helpers
          .run(path.join(__dirname, '../../src/generators/services/client'))
          .inTmpDir(dir => {
            fse.copySync(path.join(__dirname, '../data/templates/sample-app'), dir);
          })
          .withOptions({
            action: ConstantsUtils.ACTION_INIT,
            baseName: 'SampleApp',
            iac: Prompt.IAC_SAM_VALUE,
            provider: Prompt.PROVIDER_AWS_VALUE
          })
          .withPrompts(config)
          .on('ready',  (gen) => {
            // This is called right before `generator.run()` is called
            generator = gen;
          })
          .then((tempDir) => {
            const files = new ClientFiles(generator, config);
            if(config.baseNameKebabCase) {
              assert.file(path.join(tempDir, path.join(config.baseNameKebabCase, '.yo-rc.json')));
              assert.jsonFileContent(path.join(tempDir, config.baseNameKebabCase, '.yo-rc.json'), {"daswag-cli": config});
              FileTools.assertFilesExist(config, tempDir, config.baseNameKebabCase, FileTools.EXPECTED_FILES.client);
            }
          });
      });
    });
  });
});


