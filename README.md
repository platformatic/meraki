# Platformatic Meraki

## Name meaning
[TODO]

## Project Setup

### Install

```bash
$ npm install
```

### Development

### UI Components Live

This is necessary only if you want to change ui-components and see the changes live in meraki. Once that you have download the ui-components:

```
$ git clone git@github.com:platformatic/ui-components
$ cd ui-components
$ npm install
$ npm run tailwind:watch
$ cd ../meraki
$ npm link ../ui-components
$ rm -rf node_modules/.vite
```
And Relaunch the server

### Commands

* `npm run dev` to start the dev server

```bash
$ npm run dev
```

### Application Build

```bash
# For Windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```

### Release

Launch the `release` action manually, selecting the release type (`patch`, `minor`, `major`). 

[Release Action](../docs/release-action.png)




