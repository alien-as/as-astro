const {Command} = require('@astro-bin/cli')
    , structure = require('@astro-bin/structure')
    , clfmt = require('@astro-bin/console_format')
const fs = require('fs')
    , path = require('path')
const prompts = require('prompts')

/// `bc` subcommand
const cmd = new Command('bc')
cmd
    .usage({
        header: 'Manage compilers',
        content: `Common commands: {italic \
$ astro bc show
$ astro bc install adobe-air
$ astro bc update}`,
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
        ...
    })

module.exports = cmd