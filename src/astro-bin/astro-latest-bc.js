const display        = require('@astro-bin/display')
const {astroStorage} = require('@astro-lib/storage')

const chalk  = require('chalk')
    , semver = require('semver')

exports.cliLatestCompiler = args => {
    const [name, verRaw] = args
    const verRange = semver.validRange(verRaw)
    const compilers = astroStorage.compilers()

    const ls = compilers.filter(o => o.name === name)

    if (verRange && ls.length) {
        ls = ls.filter(o => semver.satisfies(o.version, verRange))
        args.splice(0, 1)
    }

    if (!ls.length) {
        display.error(`unknown compiler: ${name}`)
        process.exit(1)
    }

    ls.sort((a, b) => semver.rcompare(a.version, b.version))
    ls.splice(0, 1)
    return ls[0]
}