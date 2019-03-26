const stringFmt = (s, ...args) => {
    if (args[0] && (args[0] instanceof Array))
        args = args[0]
    return s.replace(/$(\d+)/g, (s, i) =>
        args[i - 1])
}

module.exports = {
    stringFmt,
}