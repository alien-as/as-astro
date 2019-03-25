const {Command} = require('./cli')

const cmd = new Command('astro')
    .usage({
        header: 'Build',
        content: 'FOXL9',
    })
    .subCommand(new Command('new'))
    .subCommandFunction({
        'new': args => {
            console.log('a')
            // ...
        },
    })

console.log(cmd.parse(process.argv.slice(2)))