# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Add sync command to perform create, update and delete actions in the Admin API based on the differences found in the files
- Add possibility of loading from multiple files, performing a union of each collection based on the id
- Add .konfigrc example in README.md
- Add Dockerfile example usage in README.md
- Add data substitutions when dumping/loading based on a configuration file (.konfigrc)

## [1.2.0] - 2019-06-13
### Added
- Changelog file

### Changed
- Axios version
- Dump command checks for consumer jwts if a jwt plugin and consumer exists
- Load command considers the consumerJWTs in the konfig.json

## [1.1.0] - 2019-03-13
### Added
- Flush command

## [1.0.0] - 2019-03-11
### Added
- Dump command
- Load command
