const {Command} = require('../cli')
const fs = require('fs')
    , path = require('path')

const cmd = new Command('new')

cmd
    .usage({
        header: 'Synopsis',
        content: `\
  $ astro new hello-world
  $ astro new --lib mech\
`,
    })
    .option({
        name: 'name',
        defaultOption: true,
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

        const {name} = args
        let basePath = path.join(process.cwd, name)

        if (fs.existsSync(basePath))
            console.error(`A directory/file \`${name}\` already exists`)
            process.exit(1)
        }

        ...
    })

module.exports = cmd