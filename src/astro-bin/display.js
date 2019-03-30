//! Console displaying.

const chalk = require('chalk')

module.exports = {
    // ## Formatting

    error(message) {
        console.error(chalk `{red Error:} {bgBlack {white ${ message.toString() }}}`)
    },

    ok(message) {
        console.log(chalk.blue(message))
    },

    wrapOkTerm(term) {
        return chalk.cyan.bold(term)
    },
}