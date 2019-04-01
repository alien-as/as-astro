require('module-alias/register')

const {Command}           = require('@astro-bin/command')
    ,  display            = require('@astro-bin/display')
    , {cliLatestCompiler} = require('@astro-bin/astro-latest-bc')

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
        const latest = ls.sort((a, b) => cliLatestCompiler(args))
        latest.execCommand(args)
    })

cli.parse(process.argv.slice(2))