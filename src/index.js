const {Command} = require('./cli')

const cmd = new Command('astro')
    .usage({
        header: 'Build',
        content: 'FOXL9',
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

console.log(cmd.parse(process.argv.slice(2)))