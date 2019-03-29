//! Console displaying.

const chalk = require('chalk')
const oktColor = chalk.rgb(0x1A, 0x30, 0xFF)

module.exports = {
    // ## Formatting

    error(message) {
        console.error(chalk `{magenta Error:} {bgBlack {white ${ message.toString() }}}`)
    },

    ok(message) {
        console.log(chalk.blue(message))
    },

    wrapOkTerm(term) {
        return oktColor.bold(term)
    },
}