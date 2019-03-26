const {Command} = require('./cli')
const {
    newCmd,
    initCmd,
} = require('./ops')

const cmd = new Command('astro')
cmd
    .option({
        name: 'version',
        alias: 'V',
        type: Boolean,
    })
    .subCommand(newCmd)
    .usage(cmd.optionsSection())
    .usage({
        header: 'Operations',
        content: [
            {
                name: 'new',
                summary: 'Creates package at new directory',
            },
            {
                name: 'init',
                summary: 'Initializes package',
            },
            {
                name: '',
                summary: ''
            },
            {
                name: '',
                summary: ''
            },
            {
                name: '',
                summary: ''
            },
            {
                name: '',
                summary: ''
            },
            {
                name: '',
                summary: ''
            },
            {
                name: '',
                summary: ''
            },
            {
                name: '',
                summary: ''
            },
            {
                name: '',
                summary: ''
            },
        ],
    })
    .onParse(args => {
        if (args.help)
            cmd.printUsage()
        else
            console.log('Astro FOXL9')
    })

cmd.parse(process.argv.slice(2))