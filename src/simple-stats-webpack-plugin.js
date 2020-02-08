/**
 * Reduce the webpack stats output in a lean way
 * @see https://webpack.js.org/configuration/stats/
 * @author Jan Straka
 * @mail straka@8038.ch
 * @licence MIT
 *
 */
class SimpleMessages {
    /**
     * @param options
     */
    constructor(options) {
        this.id = options && options.id ? options.id : 'simplemessages';
        this.name = 'SimpleMessages';
        this.options = options ? options : {};

        this.options['showWarnings'] = options && options.showWarnings ? options.showWarnings : true;
        this.options['showErrors'] = options && options.showErrors ? options.showErrors : true;
        this.options['showTime'] = options && options.showTime ? options.showTime : true;
    }

    /**
     * Executed when the compilation has completed
     * Goes through the compilation object and echos error messages
     * @see https://webpack.js.org/api/compiler-hooks/#done
     * @param compiler
     */
    apply(compiler) {
        compiler.hooks.done.tap(this.name, (compilation) => {
            if (this.options.showWarnings) {
                for (let i in compilation.compilation.warnings) {
                    let input = compilation.compilation.warnings[i];
                    if(input){
                        let msg = warningOutput(input);
                        if (msg) {
                            console.warn(colors['FgYellow'], msg, colors['Reset']);
                        }
                    }
                }
            }

            if (this.options.showErrors) {
                for (let i in compilation.compilation.errors) {
                    let input = compilation.compilation.errors[i];
                    if(input){
                        let msg = errorOutput(input);
                        if (msg) {
                            console.error(colors['FgRed'], msg, colors['Reset']);
                        }
                    }
                }
            }

            if (this.options['showTime']) {
                let time = new Date().toLocaleTimeString();
                let duration = compilation.endTime - compilation.startTime;
                console.log(time + ' - compiled in ' + duration + 'ms - with hash: ' + compilation.hash);
            }
        });
    }
}

module.exports = SimpleMessages;

/**
 * @see https://en.wikipedia.org/wiki/ANSI_escape_code#Colors
 * @type {{
 * FgYellow: string,
 * BgGreen: string,
 * BgCyan: string,
 * Reverse: string,
 * FgBlue: string,
 * Blink: string,
 * Dim: string,
 * BgBlack: string,
 * BgYellow: string,
 * Bright: string,
 * FgBlack: string,
 * BgBlue: string,
 * FgGreen: string,
 * FgMagenta: string,
 * Hidden: string,
 * Underscore: string,
 * FgRed: string,
 * FgCyan: string,
 * FgWhite: string,
 * BgMagenta: string,
 * Reset: string,
 * BgWhite: string,
 * BgRed: string}}
 */
const colors = {
    'Reset': "\x1b[0m",
    'Bright': "\x1b[1m",
    'Dim': "\x1b[2m",
    'Underscore': "\x1b[4m",
    'Blink': "\x1b[5m",
    'Reverse': "\x1b[7m",
    'Hidden': "\x1b[8m",

    'FgBlack': "\x1b[30m",
    'FgRed': "\x1b[31m",
    'FgGreen': "\x1b[32m",
    'FgYellow': "\x1b[33m",
    'FgBlue': "\x1b[34m",
    'FgMagenta': "\x1b[35m",
    'FgCyan': "\x1b[36m",
    'FgWhite': "\x1b[37m",

    'BgBlack': "\x1b[40m",
    'BgRed': "\x1b[41m",
    'BgGreen': "\x1b[42m",
    'BgYellow': "\x1b[43m",
    'BgBlue': "\x1b[44m",
    'BgMagenta': "\x1b[45m",
    'BgCyan': "\x1b[46m",
    'BgWhite': "\x1b[47m"
};

/**
 * Prepares the error output
 * @param error
 * @returns {string|*}
 */
function errorOutput(error) {
    if (error.error && error.error.formatted) {
        return error.error.formatted;
    }else if (error.error && error.error.message) {
        return error.error.message;
    } else if (error.error && error.error.error && error.error.error.formatted) {
        return error.error.error.formatted;
    } else if (error.message && error.module.resource && error.module.resource) {
        return error.module.resource + "\n" + error.message;
    }
}

/**
 * Prepares the warning output
 * @param warnings
 * @returns {*}
 */
function warningOutput(warnings) {
    if (warnings.message) {
        return warnings.message;
    } else if (warnings.warning && warnings.warning.message) {
        return warnings.warning.message;
    }
}