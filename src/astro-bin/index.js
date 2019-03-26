const {Command} = require('./cli')

const cmd = new Command('astro')
    .option({
        name: 'version',
        alias: 'V',
        type: Boolean,
    })
    .subCommand(newCmd)
    .subCommandFunction({
        'new': (command, args) => {
            if (args.help)
                command.printUsage()
            // ...
        },
    })

cmd
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

const args = cmd.parse(process.argv.slice(2))

if (args) {
    if (args.help) {
        cmd.printUsage()
    }
    else if (args.version) {
        console.log('Astro FOXL9')
    }
    else {
    }
}