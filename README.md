konfig-manager
==============

Kong API Gateway Config Manager

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/konfig-manager.svg)](https://npmjs.org/package/konfig-manager)
[![Downloads/week](https://img.shields.io/npm/dw/konfig-manager.svg)](https://npmjs.org/package/konfig-manager)
[![License](https://img.shields.io/npm/l/konfig-manager.svg)](https://github.com/LuanP/konfig-manager/blob/master/package.json)

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
konfig-manager/1.0.1 darwin-x64 node-v10.15.3
$ konfig --help [COMMAND]
USAGE
  $ konfig COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`konfig dump`](#konfig-dump)
* [`konfig flush`](#konfig-flush)
* [`konfig help [COMMAND]`](#konfig-help-command)
* [`konfig load`](#konfig-load)

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

_See code: [src/commands/dump.js](https://github.com/LuanP/konfig-manager/blob/v1.0.1/src/commands/dump.js)_

## `konfig flush`

Describe the command here

```
USAGE
  $ konfig flush

OPTIONS
  -n, --name=name  name to print

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/flush.js](https://github.com/LuanP/konfig-manager/blob/v1.0.1/src/commands/flush.js)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.1.6/src/commands/help.ts)_

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

_See code: [src/commands/load.js](https://github.com/LuanP/konfig-manager/blob/v1.0.1/src/commands/load.js)_
<!-- commandsstop -->
