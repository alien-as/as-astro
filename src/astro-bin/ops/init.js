const {Command} = require('../cli')
const fs = require('fs')
    , path = require('path')

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
          this.printUsage()
        ...
    })

module.exports = cmd