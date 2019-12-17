import chalk from "chalk";
import * as Generator from "yeoman-generator";
import Utils from "../../../utils/utils";
import {Prompt} from '../../core/prompt';
import {IAttributeSchema} from "../../model/options.model";

export class UserMgmtPrompts extends Prompt  {

  public static SYSTEM_CUP_CIP_VALUE = "cup_cip";
  public static VERIFIED_ATTRIBUTE_EMAIL_VALUE = "email";
  public static VERIFIED_ATTRIBUTE_PHONE_NUMBER_VALUE = "phone_number";
  public static USER_SIGN_IN_USERNAME_VALUE = "username";
  public static USER_SIGN_IN_EMAIL_PHONE_VALUE = "email_phone_number";
  public static ALIAS_ATTRIBUTE_EMAIL_VALUE = "email";
  public static ALIAS_ATTRIBUTE_PHONE_NUMBER_VALUE = "phone_number";
  public static ALIAS_ATTRIBUTE_PREFERRED_USERNAME_VALUE = "preferred_username";
  public static USERNAME_ATTRIBUTE_EMAIL_VALUE = "email";
  public static USERNAME_ATTRIBUTE_PHONE_NUMBER_VALUE = "phone_number";
  public static USERNAME_ATTRIBUTE_BOTH_VALUE = "email_phone_number";

  public static ATTRIBUTE_DATA_TYPE_STRING_VALUE = "String";
  public static ATTRIBUTE_DATA_TYPE_DATETIME_VALUE = "DateTime";
  public static ATTRIBUTE_DATA_TYPE_BOOLEAN_VALUE = "Boolean";
  private static ATTRIBUTE_DATA_TYPE_NUMBER_VALUE: "Number";

  public async askForReplyToEmailAddress(configValue: string | undefined): Promise<Generator.Answers> {
    return configValue === undefined ? this.generator.prompt([ {
      message: `${chalk.red('UserMgmt')} - Which reply email address do you want to use during sign up process?`,
      name: 'replyToEmailAddress',
      type: 'input',
      validate: (input: string) => {
        if (!input || input === '') {
          return 'Your reply email address cannot be empty';
        }
        if (!Utils.isValidEmail(input)) {
          return 'Your reply email address is not valid';
        }
        return true;
      }
    }]) : { replyToEmailAddress : configValue };
  }

  public async askForSystem(configValue: string | undefined): Promise<Generator.Answers> {
    return configValue === undefined ? this.generator.prompt([ {
      choices: [
        {name: 'Cognito UserPool & IdentityPool', value:UserMgmtPrompts.SYSTEM_CUP_CIP_VALUE},
      ],
      default: UserMgmtPrompts.SYSTEM_CUP_CIP_VALUE,
      message: `${chalk.red('UserMgmt')} - Which ${chalk.yellow('*User Management*')} component would you like to use?`,
      name: 'system',
      type: 'list',
    }]) : { system : configValue };
  }

  public async askForUserDataStorage(configValue: boolean | undefined): Promise<Generator.Answers> {
    return configValue === undefined ? this.generator.prompt([ {
      default: false,
      message: `${chalk.red('UserMgmt')} - Do you need an ${chalk.yellow('*User data storage*')} system?`,
      name: 'userDataStorage',
      type: 'confirm',
    }]) : { userDataStorage : configValue };
  }

  public async askForVerifiedAttributes(configValue: string[] | undefined): Promise<Generator.Answers> {
    return configValue === undefined ? this.generator.prompt([ {
      choices: [
        {name: 'Email', value: UserMgmtPrompts.VERIFIED_ATTRIBUTE_EMAIL_VALUE, checked:true},
        {name: 'Phone number', value: UserMgmtPrompts.VERIFIED_ATTRIBUTE_PHONE_NUMBER_VALUE},
      ],
      message: `${chalk.red('UserMgmt')} - Which ${chalk.yellow('*Attributes*')} do you want to verify?`,
      name: 'verifiedAttributes',
      type: 'checkbox',
    }]) : { verifiedAttributes : configValue };
  }

  public async askForUserSignUp(configValue: boolean | undefined): Promise<Generator.Answers> {
    return configValue === undefined ? this.generator.prompt([ {
      message: `${chalk.red('UserMgmt')} - Do you want to allow users to sign themselves up?`,
      name: 'userSignUp',
      type: 'confirm',
    }]) : { userSignUp : configValue };
  }

  public async askForUserSignIn(configValue: string | undefined): Promise<Generator.Answers> {
    return configValue === undefined ? this.generator.prompt([ {
      choices: [
        {name: 'Username - Users can use a username and optionally multiple alternatives to sign up and sign in', value: UserMgmtPrompts.USER_SIGN_IN_USERNAME_VALUE},
        {name: 'Email address or phone number - Users can use an email address or phone number as their "username" to sign up and sign in.', value:  UserMgmtPrompts.USER_SIGN_IN_EMAIL_PHONE_VALUE},
      ],
      message: `${chalk.red('UserMgmt')} - How do you want your end users to sign in?`,
      name: 'userSignIn',
      type: 'list',
    }]) : { userSignIn : configValue };
  }

  public async askForAliasAttributes(configValue: string[] | undefined): Promise<Generator.Answers> {
    return configValue === undefined ? this.generator.prompt([ {
      choices: [
        {name: 'Also allow sign in with verified email address', value: UserMgmtPrompts.ALIAS_ATTRIBUTE_EMAIL_VALUE},
        {name: 'Also allow sign in with verified phone number', value: UserMgmtPrompts.ALIAS_ATTRIBUTE_PHONE_NUMBER_VALUE},
        {name: 'Also allow sign in with preferred username (a username that your users can change)', value: UserMgmtPrompts.ALIAS_ATTRIBUTE_PREFERRED_USERNAME_VALUE},
      ],
      message: `${chalk.red('UserMgmt')} - Which optional alternatives do you want to use for sign up and sign in?`,
      name: 'aliasAttributes',
      type: 'checkbox',
    }]) : { aliasAttributes : configValue };
  }

  public async askForUsernameAttributes(configValue: string | undefined): Promise<Generator.Answers> {
    return configValue === undefined ? this.generator.prompt([ {
      choices: [
        {name: 'Allow email addresses', value: UserMgmtPrompts.USERNAME_ATTRIBUTE_EMAIL_VALUE, checked: true},
        {name: 'Allow phone numbers', value: UserMgmtPrompts.USERNAME_ATTRIBUTE_PHONE_NUMBER_VALUE},
        {name: 'Allow both email addresses and phone numbers (users can choose one)', value: UserMgmtPrompts.USERNAME_ATTRIBUTE_BOTH_VALUE},
      ],
      message: `${chalk.red('UserMgmt')} - Which field do you want to use to sign up and sign in?`,
      name: 'usernameAttributes',
      type: 'list',
    }]) : { usernameAttributes : configValue };
  }

  public async askForUserSchemas(userSchemas: IAttributeSchema[] | undefined): Promise<any> {
    // Display current user schemas
    const userSchemasValues : IAttributeSchema[] = userSchemas ? userSchemas : [];
    if(userSchemasValues && userSchemasValues.length > 0) {
      this.generator.log(`\n${chalk.yellow(`Your user schema already contains those attributes: ${this.displayUserSchema(userSchemasValues)}`)}\n`);
    }
    let answerAddAttribute = await this.askForAddUserAttribute();
    if(answerAddAttribute && answerAddAttribute.addUserAttribute && answerAddAttribute.addUserAttribute !== Prompt.ADD_ATTRIBUTE_NONE_VALUE) {
      while(answerAddAttribute && answerAddAttribute.addUserAttribute && answerAddAttribute.addUserAttribute !== Prompt.ADD_ATTRIBUTE_NONE_VALUE) {
        let userSchema : IAttributeSchema = {};
        const answerName = await this.askForUserAttributeParameterName(answerAddAttribute.addUserAttribute === Prompt.ADD_ATTRIBUTE_CUSTOM_VALUE);
        // 2. Choose parameter type ()
        let answerAttributeDataType: Generator.Answers = {};
        if(answerAddAttribute.addUserAttribute === UserMgmtPrompts.ADD_ATTRIBUTE_CUSTOM_VALUE) {
          answerAttributeDataType = {
            custom: true,
            ...await this.askForAttributeDataType()
          };
        } else if(answerName && answerName.name) {
          answerAttributeDataType = {
            attributeDataType: Prompt.mapAttributeDataType(answerName.name),
          }
        }
        // 3. Choose mutable value
        const answerMutable = await this.askForMutable();
        // 4. Choose required value
        const answerRequired = await this.askForRequired();
        // 5. Attribute constraint
        let answerConstraint = {};
        if(answerAttributeDataType && answerAttributeDataType.attributeDataType && answerAttributeDataType.attributeDataType === 'Number') {
          const answerAddConstraint = await this.askForNumberConstraint();
          if(answerAddConstraint && answerAddConstraint.addConstraint) {
            answerConstraint = {
              numberAttributeConstraints: {
                ...await this.askForMaxValue(),
                ...await this.askForMinValue(),
              },
            }
          }
        } else if(answerAttributeDataType && answerAttributeDataType.attributeDataType && answerAttributeDataType.attributeDataType === 'String') {
          const answerAddConstraint = await this.askForStringConstraint();
          if(answerAddConstraint && answerAddConstraint.addConstraint) {
            answerConstraint = {
              stringAttributeConstraints: {
                ...await this.askForMaxLength(),
                ...await this.askForMinLength(),
              },
            }
          }
        }

        userSchema = {
          ...answerName,
          ...answerAttributeDataType,
          ...answerRequired,
          ...answerMutable,
          ...answerConstraint,
        };
        // Then add it to schema
        userSchemasValues.push(userSchema);

        // Display current user schemas
        if(userSchemasValues) {
          this.generator.log(`\n${chalk.yellow(`Your user schema contains those attributes: ${this.displayUserSchema(userSchemasValues)}`)}\n`);
        }

        // Finally, ask for a new attribute
        answerAddAttribute = await this.askForAddUserAttribute();
      }
    }
    return {
      userSchemas: userSchemasValues
    };
  }

  public async askForUserAttributeParameterName(custom: boolean): Promise<Generator.Answers> {
    if(custom) {
      return this.generator.prompt([{
        message: `${chalk.red('UserMgmt')} - What is the name of your attribute?`,
        name: 'name',
        type: 'input',
        validate: (input: string) => {
          if (!/[\w-:]{0,20}/.test(input)) {
            return 'Your attribute name is not valid.';
          }
          return true;
        }
      }]);
    } else {
      return this.generator.prompt([{
        choices: [
          {name: 'address', value: 'address'},
          {name: 'birthdate', value: 'birthdate'},
          {name: 'email', value: 'email'},
          {name: 'family_name', value: 'family_name'},
          {name: 'gender', value: 'gender'},
          {name: 'given_name', value: 'given_name'},
          {name: 'locale', value: 'locale'},
          {name: 'middle_name', value: 'middle_name'},
          {name: 'name', value: 'name'},
          {name: 'nickname', value: 'nickname'},
          {name: 'phone_number', value: 'phone_number'},
          {name: 'picture', value: 'picture'},
          {name: 'preferred_username', value: 'preferred_username'},
          {name: 'profile', value: 'profile'},
          {name: 'timezone', value: 'timezone'},
          {name: 'updated_at', value: 'updated_at'},
          {name: 'website', value: 'website'},
        ],
        message: `${chalk.red('UserMgmt')} - Which standard attribute do you want?`,
        name: 'name',
        type: 'list',
      }]);
    }
  }

  public async askForAttributeDataType(): Promise<Generator.Answers> {
    return this.generator.prompt([{
      choices: [
        {name: 'String', value: UserMgmtPrompts.ATTRIBUTE_DATA_TYPE_STRING_VALUE},
        {name: 'Number', value: UserMgmtPrompts.ATTRIBUTE_DATA_TYPE_NUMBER_VALUE},
        {name: 'DateTime', value: UserMgmtPrompts.ATTRIBUTE_DATA_TYPE_DATETIME_VALUE},
        {name: 'Boolean', value: UserMgmtPrompts.ATTRIBUTE_DATA_TYPE_BOOLEAN_VALUE},
      ],
      message: `${chalk.red('UserMgmt')} - What is the type of your attribute ()?`,
      name: 'attributeDataType',
      type: 'list',
    }]);
  }

  public async askForAddUserAttribute(): Promise<Generator.Answers> {
    return this.generator.prompt([ {
      choices: [
        {name: 'Yes, a standard attribute (from OpenId Connect specification: address, birthdate, email, family_name, gender, given_name, locale, middle_name, name, nickname, phone_number, picture, preferred_username, profile, timezone, updated_at, website)', value: Prompt.ADD_ATTRIBUTE_STANDARD_VALUE},
        {name: 'Yes, a custom attribute', value: Prompt.ADD_ATTRIBUTE_CUSTOM_VALUE},
        {name: 'None', value: UserMgmtPrompts.ADD_ATTRIBUTE_NONE_VALUE},
      ],
      message: `${chalk.red('UserMgmt')} - Do you want to add an attribute to your user schema?`,
      name: 'addUserAttribute',
      type: 'list',
    }]);
  }

  private displayUserSchema(userSchemasValues: IAttributeSchema[]) {
    let displayValues = userSchemasValues.length > 0 ? '' : 'None';
    userSchemasValues.forEach((value: IAttributeSchema) => {
      displayValues += value.name +  ' ';
    });
    return displayValues;
  }
}
