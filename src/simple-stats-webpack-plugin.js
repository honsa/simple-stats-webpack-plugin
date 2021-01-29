/**
 * Reduce the webpack stats output in a lean way
 * @see https://webpack.js.org/configuration/stats/
 * @author honsa
 * @mail straka@8038.ch
 * @licence MIT
 *
 */
class SimpleMessages {
    /**
     * @param options
     */
    constructor(options) {
        this.id = options && typeof options.id !== 'undefined' ? options.id : 'simplemessages';
        this.name = 'SimpleMessages';
        this.options = options ? options : {};

        this.options['showWarnings'] = options && typeof options.showWarnings !== 'undefined' ? options.showWarnings : true;
        this.options['showErrors'] = options && typeof options.showErrors !== 'undefined' ? options.showErrors : true;
        this.options['showTime'] = options && typeof options.showTime !== 'undefined' ? options.showTime : true;
        this.options['clearConsole'] = options && typeof options.clearConsole !== 'undefined' ? options.clearConsole : true;
        this.options['showHash'] = options && typeof options.showHash !== 'undefined' ? options.showHash : true;
        this.options['showRun'] = options && typeof options.showRun !== 'undefined' ? options.showRun : true;
        this.options['showActivity'] = options && typeof options.showActivity !== 'undefined' ? options.showActivity : true;

        this.loading = false;
    }

    /**
     * Executed when the compilation has completed
     * Goes through the compilation object and echos error messages
     * @see https://webpack.js.org/api/compiler-hooks/#done
     * @param compiler
     */
    apply(compiler) {

        /**
         * Hook in after compilation and look for errors
         */
        compiler.hooks.done.tap(this.name, (compilation) => {

            if (this.showActivity && this.loading) {
                clearInterval(this.loading);
            }

            if (this.options.clearConsole) {
                clearConsole();
            }

            if (this.options.showWarnings) {
                if (0 < compilation.compilation.warnings.length) {
                    let warningsLength = parseInt(compilation.compilation.warnings.length);
                    console.log(colors['BgYellow'] + colors['FgBlack'] + (warningsLength > 1 ? warningsLength + ' WARNINGS' : warningsLength + ' WARNING') + colors['Reset']);
                    for (let i in compilation.compilation.warnings) {
                        let input = compilation.compilation.warnings[i];
                        if (input) {
                            let msg = warningOutput(input);
                            if (msg) {
                                console.log(colors['FgYellow'] + msg.trim() + colors['Reset']);
                            }
                        }
                    }
                }
            }

            if (this.options.showErrors) {
                if (0 < compilation.compilation.errors.length) {
                    let errorsLength = parseInt(compilation.compilation.errors.length);
                    console.log(colors['BgRed'] + colors['FgBlack'] + (errorsLength > 1 ? errorsLength + ' ERRORS' : errorsLength + ' ERROR') + colors['Reset']);
                    for (let i in compilation.compilation.errors) {
                        let input = compilation.compilation.errors[i];
                        if (input) {
                            let msg = errorOutput(input);
                            if (msg) {
                                console.log(colors['FgRed'] + msg.trim() + colors['Reset']);
                            }
                        }
                    }
                }
            }

            if (this.options['showTime']) {
                let time = new Date().toLocaleTimeString();
                let duration = compilation.endTime - compilation.startTime;
                let hash = this.options['showHash'] ? ' - with hash: ' + compilation.hash : '';
                console.log(time + ' - compiled in ' + duration + 'ms' + hash);
            }
        });

        /**
         * Hook into watch runs and show loading animation
         */
        compiler.hooks.watchRun.tap(this.name, (context, entry) => {
            if (this.showActivity && this.options.showRun) {
                let time = new Date().toLocaleTimeString();
                clearConsole();
                console.log(time + ' - start run...');

                this.loading = (function () {
                    let chars = ['o', 'O', 'o'];
                    let i = 0;

                    return setInterval(() => {
                        i = (i > 2) ? 0 : i;

                        let i2 = i + 1;
                        if (i2 > 2) {
                            i2 = 0;
                        }

                        let i3 = i + 2;
                        if (i3 > 2 && i2 === 0) {
                            i3 = 1;
                        } else if (i3 > 2) {
                            i3 = 0
                        }

                        clearConsole();
                        console.log(new Date().toLocaleTimeString() + ' - ' + chars[i] + chars[i2] + chars[i3]);
                        i++;
                    }, 300);
                })();
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
    } else if (error.message && error.module && error.module.resource) {
        return error.module.resource + "\n" + error.message;
    } else if (error.error && error.error.message) {
        return error.error.message;
    } else if (error.error && error.error.error && error.error.error.formatted) {
        return error.error.error.formatted;
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

/**
 * https://stackoverflow.com/a/9452971/9015191
 */
function clearConsole() {
    if(process.stdout.getWindowSiz){
        let lines = process.stdout.getWindowSize()[1];
        for(let i = 0; i < lines; i++) {
            console.log('\r\n');
        }
    }

    console.clear();
}