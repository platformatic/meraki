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

### Prepare a release tag

Releases are created from tags, so you need to create a tag before you can create a release, e.g. if the current development version is `0.1.0`:

```bash
git pull # Make sure you have the latest changes
git tag -a v0.1.0 -m "Release 0.1.0"
git push origin v0.1.0
```

Then you have to do a version bump:
```bash
npm version --no-git-tag-version minor # or major, patch, etc.
git add package.json 
git commit -m "version bump"
git push
```



