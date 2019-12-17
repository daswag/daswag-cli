import {expect} from "chai";
import * as path from 'path';
import {IApiResourceOptions} from "../../src/generators/model/api-options.model";
import LoggerUtils from "../../src/utils/logger-utils";
import {YamlUtils} from "../../src/utils/yaml-utils";

describe('swagger-utils', () => {

  it('should transform yaml content to object', () => {
    const yamlContent = YamlUtils.readYaml(path.join(__dirname, '../data/init-swagger.yaml'));

    expect(yamlContent !== null).to.be.equal(true);
    expect(yamlContent.openapi).to.be.eq("3.0.1");
  });

  it('should not transform any as the given file does not exist', () => {
    const yamlContent = YamlUtils.readYaml(path.join(__dirname, '../data/test-unknown-file.yaml'));

    expect(yamlContent).to.be.equal(undefined);
  });

  it('should add create allowed methods string', () => {
    const resource : IApiResourceOptions = {
      name : "User",
      methods: [
        {
          type: 'get'
        }, {
          type: 'post'
        }
      ]
    };
    const allowMethods = YamlUtils.buildAllowMethods(resource);
    expect(allowMethods).to.be.equal("'OPTIONS, GET, POST'");
  });

  it('should add create allowed methods string', () => {
    const resource : IApiResourceOptions = {
      name : "User",
      methods: []
    };
    const allowMethods = YamlUtils.buildAllowMethods(resource);
    expect(allowMethods).to.be.equal("'OPTIONS'");
  });

  it('should add a new resource', () => {
    const content = YamlUtils.readYaml(path.join(__dirname, '../data/init-swagger.yaml'));
    YamlUtils.addSwaggerResource(content, {
      name: 'user',
      nameKebabCase: 'user',
      nameCamelCase: 'User',
      nameSnakeCase: 'user',
      path: '/users',
    });
    expect(JSON.stringify(content)).to.be.equal(JSON.stringify(YamlUtils.readYaml(path.join(__dirname, '../data/result-swagger-resource.yaml'))));
  });

  it('should add a new object entity', () => {
    const content = YamlUtils.readYaml(path.join(__dirname, '../data/result-swagger-resource.yaml'));

    YamlUtils.addSwaggerEntity(content, {
      name: 'user',
      nameKebabCase: 'user',
      nameCamelCase: 'User',
      nameSnakeCase: 'user',
      type: 'object',
      attributes: [
        {
          name: 'id',
          attributeDataType: 'string',
          required: true
        },
        {
          name: 'firstName',
          attributeDataType: 'string',
          required: true,
          stringAttributeConstraints: {
            minLength: 2
          }
        },
        {
          name: 'lastName',
          attributeDataType: 'string',
          stringAttributeConstraints: {
            minLength: 2,
            maxLength: 10
          }
        },
        {
          name: 'age',
          attributeDataType: 'number',
          required: true,
          numberAttributeConstraints: {
            minValue: 0,
            maxValue: 100
          }
        },
        {
          name: 'test',
          attributeDataType: 'integer'
        },
        {
          name: 'activate',
          attributeDataType: 'boolean'
        }
      ]
    });
    expect(JSON.stringify(content)).to.be.equal(JSON.stringify(YamlUtils.readYaml(path.join(__dirname, '../data/result-swagger-entity-user.yaml'))));
  });

  it('should add a new array entity', () => {
    const content = YamlUtils.readYaml(path.join(__dirname, '../data/result-swagger-entity-user.yaml'));

    YamlUtils.addSwaggerEntity(content, {
      name: 'users',
      nameKebabCase: 'users',
      nameCamelCase: 'Users',
      nameSnakeCase: 'users',
      type: 'array',
      linkedEntityName: 'User',
    });
    expect(JSON.stringify(content)).to.be.equal(JSON.stringify(YamlUtils.readYaml(path.join(__dirname, '../data/result-swagger-entity-users.yaml'))));
  });

  it('should add a new method', () => {
    const logger = LoggerUtils.createLogger('test')
    const content = YamlUtils.readYaml(path.join(__dirname, '../data/result-swagger-entity-users.yaml'));
    // Create entities
    const method = {
      type: 'get',
      summary: 'Get all users',
      name: 'GetAllUsers',
      nameCamelCase: 'GetAllUsers',
      nameSnakeCase: 'get_all_users',
      linkedEntityName: 'Users'
    };
    const resource = {
      name: 'user',
      nameKebabCase: 'user',
      nameCamelCase: 'User',
      nameSnakeCase: 'user',
      path: '/users',
      methods: [
        method,
      ]
    };
    YamlUtils.addSwaggerMethod(content, resource, method);
    expect(JSON.stringify(content)).to.be.equal(JSON.stringify(YamlUtils.readYaml(path.join(__dirname, '../data/result-swagger-method.yaml'))));
  });

  it('should add a new function', () => {
    const logger = LoggerUtils.createLogger('test')
    const content = YamlUtils.readYaml(path.join(__dirname, '../data/init-template.yaml'));
    // Create entities
    const method = {
      type: 'get',
      summary: 'Get all users',
      name: 'GetAllUsers',
      nameCamelCase: 'GetAllUsers',
      nameSnakeCase: 'get_all_users',
      linkedEntityName: 'Users'
    };
    const resource = {
      name: 'users',
      nameKebabCase: 'users',
      nameCamelCase: 'Users',
      nameSnakeCase: 'users',
      path: '/users',
      methods: [
        method,
      ]
    };
    YamlUtils.addTemplateFunction(content, resource, method);
    expect(JSON.stringify(content)).to.be.equal(JSON.stringify(YamlUtils.readYaml(path.join(__dirname, '../data/result-template-function.yaml'))));
  });
});
