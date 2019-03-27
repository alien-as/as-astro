const validPackageName = name =>
    name && name.match(/[A-Za-z0-9]+([\-_][A-Za-z0-9]+)*/)[0] === name

module.exports = {
    validPackageName,
}