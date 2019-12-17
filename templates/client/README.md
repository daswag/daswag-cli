# <%= baseNameCamelCase %>

This is a sample daSWAG template for your Client.

## Requirements

* AWS CLI already configured with at least PowerUser permission
* [NodeJS installed](https://nodejs.org/en/download/)

## Setup process

### Building the project

When you make changes to your source code or dependency manifest,
run the following command to build your project local testing and deployment:

```bash
make build
```

By default, this command writes built artifacts to `dist/` folder.

### Local development

Run this command to run locally your web service. You will then be able to access your application by navigating to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

```bash
make serve
```

## Deployment

Firstly, we need a specific user used to deploy your stack following the `Least Privilege principle` - If you don't have a technical user to deploy your user management component then this is a good time to create one:

```bash
make deploy-init
```

Next, the following command will create a Cloudformation Stack used to expose your website publicly and create all needed resources.

```bash
make deploy
```

> **See [daSWAG HOWTO Guide] for more details on daSWAG Client component integration.**

After deployment is complete you can run the following command to retrieve the Stack outpus:

```bash
make output
```

Then, you are now able to generate your application configuration file based on deployed resources. This configuration file is mandatory to be able to use the user management system (Authentication, SignUp, ...):

```bash
make generate-config
```

Finally, you can update your website content by using this command:
```bash
make update-content
```

## Testing

If you need to run your tests, you simply need to execute the following command:

```bash
make test
```

**NOTE**: It is recommended to use a Python Virtual environment to separate your application development from  your system Python installation.

## Production

By default all your resources are going to be built for a development environment. If you need to deploy to other stage, you simply need to add a `STAGE_NAME=your-env` parameters on each previous command.

For example to deploy into production you will have:

```bash
make build STAGE_NAME=prod

make deploy STAGE_NAME=prod

make update-content STAGE_NAME=prod
```

# Appendix

## daSWAG CLI commands

daSWAG CLI commands to build, package, deploy and describe outputs defined within the cloudformation stack:

```bash
make build

make serve

make deploy

make generate-config

make update-content

make output

```
