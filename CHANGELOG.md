# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Added
- Test for merging files

### Fixed
- Sync deletion order

## [1.4.3] - 2019-07-02
### Fixed
- Sync creation order

## [1.4.2] - 2019-07-02
### Fixed
- Sync equality check between objects

## [1.4.1] - 2019-06-26
### Fixed
- Sync equality check between objects

## [1.4.0] - 2019-06-26
### Added
- Documentation on how to use with docker multi stage, multiple files and example of a .konfigrc

## [1.3.0] - 2019-06-26
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
