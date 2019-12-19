import * as path from 'path';
import * as assert from 'yeoman-assert';
import * as helpers from 'yeoman-test';
import {Base} from "../../src/generators/core/base";
import {Prompt} from '../../src/generators/core/prompt';
import {IUserMgmtOptions} from "../../src/generators/model/user-mgmt-options.model";
import {UserMgmtFiles} from "../../src/generators/services/user-mgmt/user-mgmt-files";
import {ConstantsUtils} from "../../src/utils/constants-utils";
import LoggerUtils from "../../src/utils/logger-utils";
import FileTools from "../tools/file-tools";

describe('daswag:user-mgmt', () => {
  context('generate a UserMgmt service', () => {

    describe('with standard user parameters', () => {
      let generator: Base;
      const config : IUserMgmtOptions = {
        replyToEmailAddress: "test@ippon.fr",
        system: "cup_cip",
        userSchemas: [{
          attributeDataType: 'string',
          mutable: true,
          name: 'name',
          custom: false,
          required: true,
          stringAttributeConstraints: {
            maxLength: '20',
            minLength: '10'
          },
        }],
        userDataStorage: true,
        adminGroup: true,
        usernameAttributes: "email_phone_number",
        userSignIn: "email_phone_number",
        userSignUp: true,
        verifiedAttributes: [
          "email"
        ],
      };
      it('creates expected files for given configuration', () => {
        return helpers
          .run(path.join(__dirname, '../../src/generators/services/user-mgmt'))
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
          .then((tempDir: string) => {
            const files = new UserMgmtFiles(generator, config);
            if(config.baseNameKebabCase) {
              const logger = LoggerUtils.createLogger('Test');
              assert.file(path.join(tempDir, path.join(config.baseNameKebabCase, '.yo-rc.json')));
              assert.jsonFileContent(path.join(tempDir, config.baseNameKebabCase, '.yo-rc.json'), {"daswag-cli": config});
              FileTools.assertFilesExist(config, tempDir, config.baseNameKebabCase, FileTools.EXPECTED_FILES.userMgmt);
            }
          });
      });
    });
  });
});
