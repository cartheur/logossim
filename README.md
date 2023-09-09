![logossim](/assets/header.png)

# Node Logic-Circuit Simulator

This is **logossim**, an open source digital logic simulator for the web, built to be easily extensible.

# Project structure

The repository is using a monorepo strategy in order to separate constraints into different projects:
- [`@logossim/core`](/packages/@logossim/core/README.md)
- [`@logossim/components`](/packages/@logossim/components/README.md)
- [`@logossim/page`](/packages/@logossim/page/README.md)
- [`@logossim/component-creator`](/packages/@logossim/component-creator/README.md)

# Installation

Requirements

- [NodeJS](https://nodejs.org/en/)
- [Yarn](https://classic.yarnpkg.com/lang/en/)

Clone project and install

```
git clone https://github.com/renato-bohler/logossim.git
cd logossim
yarn
```

Run project

```
yarn start
```