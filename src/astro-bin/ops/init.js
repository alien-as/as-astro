const {Command} = require('../cli')
const fs = require('fs')
    , path = require('path')
const prompts = require('prompts')
const structure = require('../structure')

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
        group: 'kind',
    })
    .option({
        name: 'lib',
        type: Boolean,
        group: 'kind',
    })
    .onParse(args => {
        if (args.help || !args.name)
          cmd.printUsage()

        prompts({
            type: 'text',
            name: 'v',
            message: 'Current directory will be overwritten. Continue? (Y/n)',
        })
            .then(val => {
                const basePath = process.cwd()
                if (val.v.toLowerCase() === 'n')
                    return
                let {name} = args
                if (!name) name = path.basename(basePath)

                const kind = args.lib ? 'lib' : 'bin'
                structure.init(basePath, name, kind)
            },
            cause => void 0)
    })

module.exports = cmd