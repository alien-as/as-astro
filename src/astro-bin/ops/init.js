const {Command} = require('../cli')
const fs = require('fs')
    , path = require('path')
const chalk = require('chalk')
    , prompts = require('prompts')
const structure = require('../structure')

/// `init`
const cmd = new Command('init')
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
                console.log(`Initialized package \`{chalk.green(name)}\``)
            },
            cause => void 0)
    })

module.exports = cmd