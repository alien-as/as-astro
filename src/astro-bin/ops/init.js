const {Command} = require('@astro-bin/cli')
    , structure = require('@astro-bin/structure')
    , clfmt = require('@astro-bin/console_format')
const {validPackageName} = require('@astro-lib/validation')
const fs = require('fs')
    , path = require('path')
const chalk = require('chalk')
    , prompts = require('prompts')

/// `init` subcommand

const cmd = new Command('init')
cmd
    .usage({
        header: 'Synopsis',
        content: `{italic \
$ astro init
$ astro init --name proj
$ astro init --lib}`,
    })
    .option({
        name: 'name',
    })
    .option({
        name: 'bin',
        type: Boolean,
    })
    .option({
        name: 'lib',
        type: Boolean,
    })
    .onParse(args => {
        if (args.help)
          cmd.printUsage()

        prompts({
            type: 'text',
            name: 'v',
            message: 'Current directory will be overwritten. ' +
                     'Continue? (Y/n)',
        })
            .then(val => {
                if (val.v && val.v !== 'y')
                    return
                const basePath = process.cwd()

                let {name} = args
                if (!name) name = path.basename(basePath)
                if (!validPackageName(name)) {
                    clfmt.error('Illegal package name: ' + name)
                    process.exit(1)
                }

                const kind = args.lib ? 'lib' : 'bin'
                structure.init(basePath, name, kind)
                clfmt.success('Initialized package '
                    + clfmt.fmtSuccessTerm(name))
            },
            cause => 0)
    })

module.exports = cmd