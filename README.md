# Simple stats for the actual webpack version (^4.41.5)
## Set the errors and warnings to a minimum of output for maximum of information

This is a simple webpack plugin and it is just in alpha state, 
so please do not use it in your production environment.

The goal is to reduce the output of warning and error messages in a performant 
way and produce better and clearer error and warning messages, than webpack himself, 
with stats option "errors-warnings" or any other.

Set stats to `none` if you use this plugin, 
otherwise you may have duplicated errors or warnings in your output.

https://webpack.js.org/configuration/stats/

Please share webpack config and full information around 
your warnings or errors which are not recognized, 
this will help for further investigations.

## Install
```npm
$ npm i --save-dev simple-stats-webpack-plugin
```
or
```yarn
$ yarn add --dev simple-stats-webpack-plugin
```

## Use

```js
const SimpleStatsWebpackPlugin = require('simple-stats-webpack-plugin');
```

```js
plugins: [
        new SimpleStatsWebpackPlugin(),
        ...
],
```
### Options
    id : string (default: 'simplemessages') 
    showWarnings: boolean (default: true)
    showErrors: boolean (default: true)
    showTime: boolean (default: true)