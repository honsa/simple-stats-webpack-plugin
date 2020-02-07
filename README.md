# Simple stats for the actual webpack version (^4.41.5)
## Set the errors and warning to a minimum of output for maximum of information

This plugin is just in alpha state, so please do not use it in your production environment.
The goal is to reduce the output of warnings and error messages in a performant 
way and produce better and clearer error messages than webpack self with stats option 
"errors-warnings".
https://webpack.js.org/configuration/stats/

##Use

```js
const SimpleStats = require('simple-stats-webpack-plugin');
```

```js
plugins: [
        new SimpleStats(),
        ...
    ],
```
 ###Options:
    id : string (default: 'simplemessages') 
    showWarnings: boolean (default: true)
    showErrors: boolean (default: true)
    showTime: boolean (default: true)