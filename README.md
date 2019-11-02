konfig-manager
==============

Kong API Gateway Config Manager

[![Travis](https://img.shields.io/travis/luanp/konfig-manager.svg)](https://travis-ci.org/LuanP/konfig-manager)
[![Coverage Status](https://coveralls.io/repos/github/LuanP/konfig-manager/badge.svg?branch=master)](https://coveralls.io/github/LuanP/konfig-manager?branch=master)
[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/konfig-manager.svg)](https://npmjs.org/package/konfig-manager)
[![Downloads/week](https://img.shields.io/npm/dw/konfig-manager.svg)](https://npmjs.org/package/konfig-manager)
[![License](https://img.shields.io/npm/l/konfig-manager.svg)](https://github.com/LuanP/konfig-manager/blob/master/package.json)
[![Known Vulnerabilities](https://snyk.io/test/npm/konfig-manager/badge.svg)](https://snyk.io/test/npm/konfig-manager)
[![Sonar Tech Debt](https://img.shields.io/sonar/https/sonarcloud.io/LuanP_konfig-manager/tech_debt.svg)](https://sonarcloud.io/project/issues?id=LuanP_konfig-manager&resolved=false)


<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g konfig-manager
$ konfig COMMAND
running command...
$ konfig (-v|--version|version)
konfig-manager/1.5.0 darwin-x64 node-v12.13.0
$ konfig --help [COMMAND]
USAGE
  $ konfig COMMAND
...
```
<!-- usagestop -->

## Docker

Here's an example of how to use this library with docker multi stage:

```docker
FROM node:lts-alpine as konfig-manager

RUN npm install -g konfig-manager@1.4.4 --production

FROM kong:1.2.1-alpine as api-gateway

COPY --from=konfig-manager /usr/local/ /usr/local/

...
```

## Custom configuration

This library allows you to replace content based on the resource type (`plugins`, `routes`, ...) when dumping and to perform substitutions based on environment variabled when running loading.

Here it follows a `.konfigrc` example:

```json
{
  "load": {
    "substitutions": {
      "environment_variables": {
        "enabled": true,
        "white_list": ["SERVER_PROTOCOL", "SERVER_HOST", "SERVER_PORT"],
        "types": {
          "TRUSTED_ORIGINS": "list"
        }
      }
    }
  },
  "sync": {
    "substitutions": {
      "environment_variables": {
        "enabled": true,
        "white_list": ["SERVER_PROTOCOL", "SERVER_HOST", "SERVER_PORT", "TRUSTED_ORIGINS"],
        "types": {
          "TRUSTED_ORIGINS": "list"
        }
      }
    }
  },
  "dump": {
    "substitutions": {
      "plugins": {
        "config": {
          "introspection_endpoint": "${SERVER_PROTOCOL}://${SERVER_HOST}:${SERVER_PORT}/openid/introspect",
          "discovery": "${SERVER_PROTOCOL}://${SERVER_HOST}:${SERVER_PORT}/openid/.well-known/openid-configuration",
          "trusted_origins": "${TRUSTED_ORIGINS}"
      }
    },
      "routes": {
        "hosts": [
          "${SERVER_HOST}"
        ]
      }
    },
    "exceptions": {
      "routes": [
        {
          "key": "name",
          "value": "do-not-change-this-route"
        }
      ]
    }
  }
}
```

## Load / sync with several files

You can run the command by passing the `--file` several times to merge it.

```shell
konfig sync --file minimal-konfig.json --file konfig.json
```

**NOTE:** If duplicated id's are found in a collection, the data from the last file passed will be kept.


# Commands
<!-- commands -->
* [`konfig dump`](#konfig-dump)
* [`konfig flush`](#konfig-flush)
* [`konfig help [COMMAND]`](#konfig-help-command)
* [`konfig load`](#konfig-load)
* [`konfig sync`](#konfig-sync)

## `konfig dump`

Dump available Kong data in a file

```
USAGE
  $ konfig dump

OPTIONS
  --file=file  [default: konfig.json] name of file to be created as output
  --url=url    [default: http://localhost:8001] URL of the Kong Admin API

DESCRIPTION
  It requests data from Kong API endpoints and save the results in a file.
```

_See code: [src/commands/dump.js](https://github.com/LuanP/konfig-manager/blob/v1.5.0/src/commands/dump.js)_

## `konfig flush`

Flush available Kong data

```
USAGE
  $ konfig flush

OPTIONS
  --url=url  [default: http://localhost:8001] URL of the Kong Admin API

DESCRIPTION
  It requests the endpoints getting the available data and calls the DELETE endpoints.
```

_See code: [src/commands/flush.js](https://github.com/LuanP/konfig-manager/blob/v1.5.0/src/commands/flush.js)_

## `konfig help [COMMAND]`

display help for konfig

```
USAGE
  $ konfig help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.1/src/commands/help.ts)_

## `konfig load`

Load available Kong data from a file

```
USAGE
  $ konfig load

OPTIONS
  --file=file  [default: konfig.json] name of file to be loaded
  --url=url    [default: http://localhost:8001] URL of the Kong Admin API

DESCRIPTION
  It gets data from a file and loads in Kong Admin API endpoints.
```

_See code: [src/commands/load.js](https://github.com/LuanP/konfig-manager/blob/v1.5.0/src/commands/load.js)_

## `konfig sync`

Sync data from file with a Kong Admin API

```
USAGE
  $ konfig sync

OPTIONS
  --file=file  [default: konfig.json] name of file to be loaded
  --url=url    [default: http://localhost:8001] URL of the Kong Admin API

DESCRIPTION
  It gets data from a Kong Admin API and sync based on the files provided.
```

_See code: [src/commands/sync.js](https://github.com/LuanP/konfig-manager/blob/v1.5.0/src/commands/sync.js)_
<!-- commandsstop -->
