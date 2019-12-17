import {CLOUDFORMATION_SCHEMA} from "cloudformation-js-yaml-schema"
import * as fs from "fs";
import * as yaml from 'js-yaml';
import {Prompt} from "../generators/core/prompt";
import {IApiMethodOptions, IApiResourceOptions} from "../generators/model/api-options.model";
import {IAttributeSchema, IEntitySchema} from "../generators/model/options.model";
import FileUtils from "./file-utils";
import LoggerUtils from "./logger-utils";

export class YamlUtils {

  public static logger = LoggerUtils.createLogger('YamlUtils');

  public static readYaml(filePath: string) {
    try {
      if (!FileUtils.doesFileExist(filePath)) {
        this.logger.error(`Given file does not exist on path: ${filePath}`);
        return;
      }
      // Read swagger file
      return yaml.safeLoad(fs.readFileSync(filePath, 'utf8'), { schema: CLOUDFORMATION_SCHEMA });
    } catch (e) {
      throw e;
    }
  }

  public static dumpYaml(content: any, filePath: string) {
    try {
      fs.writeFileSync(filePath, yaml.safeDump(content,{ schema: CLOUDFORMATION_SCHEMA }));
    } catch (e) {
      this.logger.error(e);
      throw e;
    }
  }

  public static addSwaggerResource(content: any, resource: IApiResourceOptions) {
    if (!content.paths) {
      content.paths = {};
    }
    // Build new resource
    if (resource.path) {
      const newResource: any = {};
      newResource[resource.path] = {
        "options": {
          "responses": {
            "200": {
              "description": "200 response",
              "headers": {
                "Access-Control-Allow-Origin": {
                  "schema": {
                    "type": "string"
                  }
                },
                "Access-Control-Allow-Methods": {
                  "schema": {
                    "type": "string"
                  }
                },
                "Access-Control-Allow-Headers": {
                  "schema": {
                    "type": "string"
                  }
                }
              },
              "content": {}
            }
          },
          "x-amazon-apigateway-integration": {
            "passthroughBehavior": "when_no_match",
            "requestTemplates": {
              "application/json": "{ \"statusCode\": 200 }\n"
            },
            "responses": {
              "default": {
                "statusCode": "200",
                "responseParameters": {
                  "method.response.header.Access-Control-Allow-Methods": "'OPTIONS'",
                  "method.response.header.Access-Control-Allow-Headers": "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'",
                  "method.response.header.Access-Control-Allow-Origin": "'*'"
                },
                "responseTemplates": {
                  "application/json": "{}\n"
                }
              }
            },
            "type": "mock"
          }
        }
      };

      // Add new resource to paths
      content.paths = {
        ...content.paths,
        ...newResource,
      }
    }
  }

  public static addSwaggerMethod(content: any, resource: IApiResourceOptions, method: IApiMethodOptions) {
    if (!content.paths || (resource.path && !content.paths[resource.path])) {
      throw new Error(
        `Method ${method.name} cannot be added to resource ${resource.path}. Resource does not exist.`
      )
    }

    const newMethod: any = {};
    if (method.type && resource.path) {
      // Add new method to OPTIONS
      content.paths[resource.path].options['x-amazon-apigateway-integration'].responses.default.responseParameters['method.response.header.Access-Control-Allow-Methods'] = YamlUtils.buildAllowMethods(resource);

      newMethod[method.type] = {
        "summary": method.summary,
        "description": method.summary,
        "operationId": method.nameCamelCase,
        "security": [
          {
            "default": []
          }
        ],
        "responses": {
          "200": {
            "description": method.summary,
            "headers": {
              "Access-Control-Allow-Origin": {
                "schema": {
                  "type": "string"
                }
              }
            },
            "content": {
              "application/json": {
                "schema": {
                  "$ref": `#/components/schemas/${method.linkedEntityName}`
                }
              }
            }
          },
          "default": {
            "description": "unexpected error",
            "headers": {
              "Access-Control-Allow-Origin": {
                "schema": {
                  "type": "string"
                }
              }
            },
            "content": {
              "application/json": {
                "schema": {
                  "$ref": "#/components/schemas/Error"
                }
              }
            }
          }
        },
        "x-amazon-apigateway-integration": {
          "responses": {
            "default": {
              "statusCode": "200",
              "responseParameters": {
                "method.response.header.Access-Control-Allow-Origin": "'*'"
              }
            }
          },
          "uri": {
            "Fn::Sub": `arn:aws:apigateway:$\{AWS::Region}:lambda:path/2015-03-31/functions/$\{${method.nameCamelCase}Function.Arn}:live/invocations`
          },
          "passthroughBehavior": "when_no_match",
          "httpMethod": "POST",
          "type": "aws_proxy"
        }
      };

      content.paths[resource.path] = {
        ...content.paths[resource.path],
        ...newMethod,
      }
    }
  }

  public static addSwaggerEntity(content: any, entity: IEntitySchema) {
    if (!content.components) {
      content.components = {};
    }
    if(!content.components.schemas) {
      content.components.schemas = {};
    }

    // Build new entity schema
    if (entity.nameCamelCase) {
      const newEntity: any = {};
      // Build default structure
      if(entity.type === Prompt.ENTITY_TYPE_OBJECT_VALUE) {
        newEntity[entity.nameCamelCase] = {
          "type": entity.type,
          "required": entity.attributes ?
            entity.attributes
              .filter((attribute: IAttributeSchema) => attribute.required)
              .map((attribute: IAttributeSchema) => attribute.name) : [],
          "properties": {}
        };

        // Then build attributes
        if (entity.attributes) {
          entity.attributes.forEach((attribute: IAttributeSchema) => {
            if (entity.nameCamelCase && attribute.name) {
              newEntity[entity.nameCamelCase].properties[attribute.name] = {
                "type": attribute.attributeDataType,
              };
              if (attribute.attributeDataType === 'string' && attribute.stringAttributeConstraints) {
                if (attribute.stringAttributeConstraints.minLength !== undefined) {
                  newEntity[entity.nameCamelCase].properties[attribute.name].minLength = attribute.stringAttributeConstraints.minLength;
                }
                if (attribute.stringAttributeConstraints.maxLength !== undefined) {
                  newEntity[entity.nameCamelCase].properties[attribute.name].maxLength = attribute.stringAttributeConstraints.maxLength;
                }
              } else if (attribute.attributeDataType === 'number' && attribute.numberAttributeConstraints) {
                if (attribute.numberAttributeConstraints.minValue !== undefined) {
                  newEntity[entity.nameCamelCase].properties[attribute.name].minimum = attribute.numberAttributeConstraints.minValue;
                }
                if (attribute.numberAttributeConstraints.maxValue !== undefined) {
                  newEntity[entity.nameCamelCase].properties[attribute.name].maximum = attribute.numberAttributeConstraints.maxValue;
                }
              }
            }
          });
        }
      } else if(entity.type === Prompt.ENTITY_TYPE_ARRAY_VALUE) {
        newEntity[entity.nameCamelCase] = {
          "type": entity.type,
          "items": {
            '$ref': `#/components/schemas/${entity.linkedEntityName}`
          }
        };
      }

      // Add new entity
      content.components.schemas = {
        ...content.components.schemas,
        ...newEntity,
      }
    }
  }

  public static addTemplateFunction(content: any, resource: IApiResourceOptions, method: IApiMethodOptions) {
    if (!content.Resources) {
      content.Resources = {};
    }

    const newFunction: any = {};
    if(method.nameSnakeCase && method.nameCamelCase) {
      const formatFunctionName = method.nameCamelCase + 'Function';
      newFunction[formatFunctionName] = {
        "Type": "AWS::Serverless::Function",
        "Properties": {
          "FunctionName": {
            "class":"Sub",
            "name":"Sub",
            "data": `\${ProjectName}-\${StageName}-${method.nameCamelCase}`
          },
          "Handler": `src.handlers.${resource.nameSnakeCase}.${method.nameSnakeCase}.${method.nameSnakeCase}`,
          "Description": method.summary,
          "Timeout": 2,
          "MemorySize": 256,
          "Tracing": "Active",
          "AutoPublishAlias": "live",
          "Events": {
            "Resource": {
              "Type": "Api",
              "Properties": {
                "RestApiId": {
                  "class":"Ref",
                  "name":"Ref",
                  "data":"ApiGatewayRestApi"
                },
                "Path": resource.path,
                "Method": method.type,
              }
            }
          },
        }
      }
      content.Resources = {
        ...content.Resources,
        ...newFunction
      }
    }
  }
  public static buildAllowMethods(resource: IApiResourceOptions): string {
    const allowMethods : string[] = ["OPTIONS"];
    if(resource && resource.methods) {
      resource.methods.forEach((method: IApiMethodOptions) => {
        if(method.type) {
          allowMethods.push(method.type.toUpperCase());
        }
      });
    }
    return "'" + allowMethods.join(", ") + "'";
  }
}
