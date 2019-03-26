const chalk = require('chalk')
const successTermColor = chalk.rgb(0x1A, 0xFF, 0x30)

module.exports = {
    fmtSuccess(msg) {
        return chalk.green(msg)
    },

    fmtSuccessTerm(s) {
        return successTermColor.bold(s)
    },
}