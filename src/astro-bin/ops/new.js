const {Command} = require('../cli')
const fs = require('fs')
    , path = require('path')
const structure = require('../structure')

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
    })
    .option({
        name: 'lib',
        type: Boolean,
    })
    .onParse(args => {
        if (args.help || !args.name)
            cmd.printUsage()

        const {name} = args
        let basePath = path.join(process.cwd(), name)

        if (fs.existsSync(basePath)) {
            console.error(`A directory/file \`${name}\` already exists`)
            process.exit(1)
        }

        fs.mkdirSync(basePath)
        const kind = args.lib ? 'lib' : 'bin'
        structure.init(basePath, name, kind)
    })

module.exports = cmd