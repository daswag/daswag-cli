const AWS = require('aws-sdk');
const fs = require('fs');

AWS.config.update({region: process.env.AWS_REGION});

// Create Cloudformation service object
var cloudformation = new AWS.CloudFormation();

cloudformation.describeStacks({StackName: process.argv[2]}, function(err, data) {
  if (err) {
    console.log("An Error occurred when fetching the given Stack.");
    console.log(err.message);
  } else {
    //We need to get 2 values
    const outputs = data.Stacks[0].Outputs;
    let config = {
      identityPoolId:getOutputValue(outputs, 'IdentityPool'),
      userPoolId:getOutputValue(outputs, 'UserPool'),
      region: process.env.AWS_REGION,
      userPoolWebClientId: getOutputValue(outputs, 'UserPoolClient'),
      oauth: {
        domain: getOutputValue(outputs, 'UserPoolDomain'),
        scope: [
          "phone",
          "email",
          "openid",
          "profile",
        ],
        redirectSignIn: "",
        redirectSignOut: "",
        responseType: "code"
      },
      federationTarget: "COGNITO_USER_POOLS"
    };
    let content = JSON.stringify(config, null, 2);
    fs.writeFileSync(process.argv[3], content);
  }
});

function getOutputValue(outputs, key) {
  let value = '';
  outputs.forEach((output) => {
    if(output['OutputKey'] === key) {
      value = output['OutputValue']
    }
  })
  return value;
}
