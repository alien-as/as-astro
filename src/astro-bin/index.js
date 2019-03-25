const {Command} = require('./cli')

const cmd = new Command('astro')
    .option({
        name: 'version',
        alias: 'V',
        type: Boolean,
    })
    .subCommand(new Command('new')
        .usage({
            header: 'Synopsis',
            content: 'Ulala!',
        })
        .option({
            name: 'name',
            defaultOption: true,
        }))
    .subCommandFunction({
        'new': (command, args) => {
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
                name: 'clean',
                summary: 'Cleans ',
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
    if (args.version) {
        console.log('Astro FOXL9')
    }
}