//! Interaction with the user.

const chalk = require('chalk')

module.exports = {
    // ## Simple logging

    error(message) {
        console.error(chalk.red('Error: ') + message.toString())
    },

    // ## 
}