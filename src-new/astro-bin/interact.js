//! Interaction from to the user.

const chalk = require('chalk')
const okTermColor = chalk.rgb(0x1A, 0x30, 0xFF)

module.exports = {
    // ## Simple logging

    error(message) {
        console.error(chalk.red('Error: ') + message.toString())
    },

    ok(message) {
        console.log(chalk.blue(message))
    },

    wrapOkTerm(term) {
        return okTermColor.bold(term)
    },
}