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
                console.log(val)
                const basePath = process.cwd()
                if (!val || val.v.toLowerCase() === 'y')
                    return
                let {name} = args
                if (!name) name = path.basename(basePath)

                const kind = args.lib ? 'lib' : 'bin'
                structure.init(basePath, name, kind)
            },
            cause => void 0)
    })

module.exports = cmd