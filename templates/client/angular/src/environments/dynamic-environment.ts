declare var window: any;

export class DynamicEnvironment {

  // Amazon Cognito Identity Pool ID
  public get identityPoolId(): string {
    return window.config.identityPoolId;
  }

  // Amazon Cognito User Pool ID
  public get userPoolId(): string {
    return window.config.userPoolId;
  }
  // Amazon Cognito Web Client ID
  public get userPoolWebClientId(): string {
    return window.config.userPoolWebClientId;
  }
  // Amazon Cognito Web Client ID
  public get region(): string {
    return window.config.region;
  }
}
