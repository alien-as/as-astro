require('module-alias/register')

const {Command} = require('@astro-bin/command')
    ,  display  = require('@astro-bin/display')

const chalk = require('chalk')

// #### Operations

const [ bcCli, newCli, initCli, ] = require('./operations/$merged')

/// ## `$ astro`

const cli = new Command('astro')
cli
    .option({
        name: 'version',
        alias: 'V',
        type: Boolean,
    })
    .subCommands([
        bcCli,
        newCli, initCli,
    ])
    .usage(cli.optionsSection())
    .usage({
        header: 'Operations',
        content: [
            { name: 'bc', summary: 'Manages compilers' },
            { name: 'new', summary: 'Creates package at new directory' },
            { name: 'init', summary: 'Initializes package' },
          /*
            { name: '', summary: '' },
            { name: '', summary: '' },
            { name: '', summary: '' },
            { name: '', summary: '' },
            { name: '', summary: '' },
            { name: '', summary: '' }, */
        ],
    })
    .usage({
        header: 'Compilers',
        content: `Astro manages compilers for you. \
For executing specific compiler commands, \
you can run astro-sub:
  {italic $ astro-sub {green <compiler>} {green [version]}}
Built-in compilers are aliased; for example, air:
  {italic $ astro air}`,
    })
    .onParse(args => {
        if (args.help)
            cli.printUsage()
        else
            console.log(chalk `Running Astro ver. 0.1.0`)
    })

cli.parse(process.argv.slice(2))