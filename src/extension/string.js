const stringFormat = (s, ...args) => {
    if (args[0] && (args[0] instanceof Array))
        args = args[0]
    return s.replace(/\$(\d+|\$)/g, (_, s) =>
        s === '$' ? '$' : args[s - 1])
}

module.exports = {
    stringFormat,
}