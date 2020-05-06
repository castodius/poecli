# poecli - POEditor CLI

**THIS IS STILL WORK IN PROGRESS, MORE UPDATES TO COME**

An interactive CLI for [POEditor](https://poeditor.com), a software localization service. Manage projects, terms, languages and contributors as you see fit.

## Installation

POECLI should be installed globally.

```
npm i -g poecli
```

When uninstalling you will find the local storage for poecli at:

```
.poecli
```

## Configuration

Grab yourself an API token from [POEditor API Access](https://poeditor.com/account/api). Run **poecli token** and follow the instructions.

## Usage

Now that the CLI is configured you can check out the available options by running **poecli**. The options are grouped into four categories:

- Projects
- Languages
- Terms
- Contributors

Each option corresponds to the available API endpoints described in [POEditor API Documentation](https://poeditor.com/docs/api).

## Issues and feature requests

Have you come across a bug or simply want to discuss a feature you would like to see? Create an issue on [Github issue tracker](https://github.com/castodius/poecli/issues)