const validPackageName = name =>
    name && name.match(/[a-z0-9]+([\-_][a-z0-9]+)*/)[0] === name

module.exports = {
    validPackageName,
}