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
    .usage({
        header: 'Build',
        content: '',
    })
    .usage(cmd.optionsSection())

const args = cmd.parse(process.argv.slice(2))

if (args) {
    if (args.version) {
        console.log('Astro FOXL9')
    }
}