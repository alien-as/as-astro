const {Command} = require('@astro-bin/cli')
    , structure = require('@astro-bin/structure')
    , clfmt = require('@astro-bin/console_format')
const fs = require('fs')
    , path = require('path')
const prompts = require('prompts')

/// `bc`
const cmd = new Command('bc')
cmd
    .usage({
        header: 'Synopsis',
        content: `\
  $ astro init
  $ astro init --name proj
  $ astro init --lib\
`,
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
            message: 'Current directory will be overwritten. Continue? (Y/n)',
        })
            .then(val => {
                if (val.v && val.v !== 'y')
                    return
                const basePath = process.cwd()
                let {name} = args
                if (!name) name = path.basename(basePath)
                const kind = args.lib ? 'lib' : 'bin'
                structure.init(basePath, name, kind)
            },
            cause => void 0)
    })

module.exports = cmd