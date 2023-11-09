# Stackables Wizard

## Development

### UI Components Live

Once that you have download the ui-components

```
$ git clone git@github.com:platformatic/ui-components
$ cd ui-components
$ npm install
$ npm run tailwind:watch
$ cd ../dashformatic
$ npm link ../ui-components
$ rm -rf node_modules/.vite
```
An Relaunch the dashformatic server 

### Commands

* `npm run dev` to start the dev server

* `npm run build` to build the app in `dist`