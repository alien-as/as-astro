require('module-alias/register')

const {Command} = require('@astro-bin/command')
    ,  display  = require('@astro-bin/display')

const {astroStorage} = require('@astro-lib/storage')

const chalk  = require('chalk')
    , semver = require('semver')

/// ## `$ astro-sub`

const cli = new Command('astro-sub')
cli
    .usage({
        header: 'Synopsis',
        content: `{italic \
$ astro-sub {green <compiler>} {green [version]} {green <command>}}`
    })
    .onParse(args => {
        cli.printUsage()
    })
    .onUnknown(args => {
        const [name, verRaw] = args
        const verRange = semver.validRange(verRange)

        const compilers = astroStorage.compilers()

        if (verRange) {
            ...
        } else {
            const ls = compilers.filter(o => o.name === name)
            if (!ls.length) {
                display.error(`unknown compiler: ${name}`)
                process.exit(1)
            }
            ls.sort(semver.rcomparator)[ls.length - 1]
            if (ls
        }
    })

cli.parse(process.argv.slice(2))