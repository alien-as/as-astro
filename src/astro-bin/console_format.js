const chalk = require('chalk')
const successTermColor = chalk.rgb(0x1A, 0x30, 0xFF)

module.exports = {
    fmtSuccess(msg) {
        return chalk.blue(msg)
    },

    fmtSuccessTerm(s) {
        return successTermColor.bold(s)
    },
}