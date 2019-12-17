daSWAG: Serverless Web Application Generator CLI
==========

Generate your full Serverless Web Application in seconds with daswag cli

[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Gitter](https://badges.gitter.im/daswag/community.svg)](https://gitter.im/daswag/community?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge)
[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/daswag-cli.svg)](https://npmjs.org/package/daswag-cli)
[![Build Status](https://codebuild.eu-west-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoieFJrZm9PaGlKZWJKTi9yd0hKVHMyWDhlWmtod1FYa0EzZnZlcm16WEJROEoxcXNsOERKZzA3VkcwLzNLSnJMVGY3RzZDV1lGWFlxamxKTnliWkZlZTA0PSIsIml2UGFyYW1ldGVyU3BlYyI6InNuV3l3dTZ5WUxNWGZlYWMiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=master)](https://codebuild.eu-west-1.amazonaws.com/badges?uuid=eyJlbmNyeXB0ZWREYXRhIjoieFJrZm9PaGlKZWJKTi9yd0hKVHMyWDhlWmtod1FYa0EzZnZlcm16WEJROEoxcXNsOERKZzA3VkcwLzNLSnJMVGY3RzZDV1lGWFlxamxKTnliWkZlZTA0PSIsIml2UGFyYW1ldGVyU3BlYyI6InNuV3l3dTZ5WUxNWGZlYWMiLCJtYXRlcmlhbFNldFNlcmlhbCI6MX0%3D&branch=master)
[![Coverage](https://sonarcloud.io/api/project_badges/measure?project=daswag_daswag-cli&metric=coverage)](https://sonarcloud.io/dashboard?id=daswag_daswag-cli)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=daswag_daswag-cli&metric=security_rating)](https://sonarcloud.io/dashboard?id=daswag_daswag-cli)
[![Downloads/week](https://img.shields.io/npm/dw/daswag-cli.svg)](https://npmjs.org/package/daswag-cli)

<!-- toc -->
* [Description](#description)
* [Getting Started](#getting-started)
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->

# Description

This is a framework for building Web Application using only Serverless technologies.

[See the docs for more information](https://www.daswag.tech/documentation).

# Getting Started

The [Getting Started tutorial](https://www.daswag.tech/documentation/getting_started) is a step-by-step guide to introduce you to daSWAG. If you have not developed anything using Serverless technologies, this Getting Started is a great place to get started.

# Usage
<!-- usage -->
```sh-session
$ npm install -g daswag-cli
$ daswag COMMAND
running command...
$ daswag (-v|--version|version)
daswag-cli/1.0.8 darwin-x64 node-v12.11.0
$ daswag --help [COMMAND]
USAGE
  $ daswag COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`daswag add`](#daswag-add)
* [`daswag add:entity`](#daswag-addentity)
* [`daswag add:method`](#daswag-addmethod)
* [`daswag add:resource`](#daswag-addresource)
* [`daswag autocomplete [SHELL]`](#daswag-autocomplete-shell)
* [`daswag create`](#daswag-create)
* [`daswag create:api`](#daswag-createapi)
* [`daswag create:client`](#daswag-createclient)
* [`daswag create:user-mgmt`](#daswag-createuser-mgmt)
* [`daswag help [COMMAND]`](#daswag-help-command)
* [`daswag new`](#daswag-new)
* [`daswag update`](#daswag-update)

## `daswag add`

generate a new component

```
USAGE
  $ daswag add
```

_See code: [src/commands/add/index.ts](https://github.com/daswag/daswag-cli/blob/v1.0.8/src/commands/add/index.ts)_

## `daswag add:entity`

add a new Api resource

```
USAGE
  $ daswag add:entity
```

_See code: [src/commands/add/entity.ts](https://github.com/daswag/daswag-cli/blob/v1.0.8/src/commands/add/entity.ts)_

## `daswag add:method`

generate a new Api method

```
USAGE
  $ daswag add:method
```

_See code: [src/commands/add/method.ts](https://github.com/daswag/daswag-cli/blob/v1.0.8/src/commands/add/method.ts)_

## `daswag add:resource`

generate a new Api resource

```
USAGE
  $ daswag add:resource
```

_See code: [src/commands/add/resource.ts](https://github.com/daswag/daswag-cli/blob/v1.0.8/src/commands/add/resource.ts)_

## `daswag autocomplete [SHELL]`

display autocomplete installation instructions

```
USAGE
  $ daswag autocomplete [SHELL]

ARGUMENTS
  SHELL  shell type

OPTIONS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

EXAMPLES
  $ daswag autocomplete
  $ daswag autocomplete bash
  $ daswag autocomplete zsh
  $ daswag autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v0.1.4/src/commands/autocomplete/index.ts)_

## `daswag create`

create a new service

```
USAGE
  $ daswag create
```

_See code: [src/commands/create/index.ts](https://github.com/daswag/daswag-cli/blob/v1.0.8/src/commands/create/index.ts)_

## `daswag create:api`

add an Api service

```
USAGE
  $ daswag create:api
```

_See code: [src/commands/create/api.ts](https://github.com/daswag/daswag-cli/blob/v1.0.8/src/commands/create/api.ts)_

## `daswag create:client`

add a client service

```
USAGE
  $ daswag create:client
```

_See code: [src/commands/create/client.ts](https://github.com/daswag/daswag-cli/blob/v1.0.8/src/commands/create/client.ts)_

## `daswag create:user-mgmt`

create an user management service

```
USAGE
  $ daswag create:user-mgmt
```

_See code: [src/commands/create/user-mgmt.ts](https://github.com/daswag/daswag-cli/blob/v1.0.8/src/commands/create/user-mgmt.ts)_

## `daswag help [COMMAND]`

display help for daswag

```
USAGE
  $ daswag help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.1/src/commands/help.ts)_

## `daswag new`

Create a new application

```
USAGE
  $ daswag new
```

_See code: [src/commands/new/index.ts](https://github.com/daswag/daswag-cli/blob/v1.0.8/src/commands/new/index.ts)_

## `daswag update`

create a new service

```
USAGE
  $ daswag update
```

_See code: [src/commands/update/index.ts](https://github.com/daswag/daswag-cli/blob/v1.0.8/src/commands/update/index.ts)_
<!-- commandsstop -->
