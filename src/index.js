const {Command} = require('./cli')

const cmd = new Command('astro')
    .usage({
        header: 'Build',
        content: 'FOXL9',
    })
    .subCommand(new Command('new'))

console.log(cmd.parse(process.argv.slice(2)))