const {Command} = require('./cli')

const cmd = new Command('astro')
    .usage({
        header: 'Build',
        content: 'FOXL9',
    })
    .option({
        name: 'version',
        alias: 'V',
        type: Boolean,
    })
    .subCommand(new Command('new')
        .usage({
            header: 'Synopsis',
            content: 'Ulala!',
        }))
    .subCommandFunction({
        'new': (command, args) => {
            // ...
        },
    })

const args = cmd.parse(process.argv.slice(2))

if (args) {
    if (args.version) {
        console.log('Astro FOXL9')
    }
}