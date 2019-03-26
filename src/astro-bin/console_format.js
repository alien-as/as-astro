const chalk = require('chalk')
const successTermColor = chalk.rgb(0x1A, 0x30, 0xFF)

module.exports = {
    error(msg) {
        console.error(chalk.red('Error: ') + msg)
    },

    success(msg) {
        console.log(chalk.blue(msg))
    },

    fmtSuccessTerm(s) {
        return successTermColor.bold(s)
    },
}