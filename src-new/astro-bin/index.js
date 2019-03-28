require('module-alias/register')

const {Command} = require('./cli')
    , structure = require('./structure')
    , clfmt = require('./console-format')

const chalk = require('chalk')

// Operations
//
const { bcCli, newCli, initCli, }
    = require('./ops')

/// `$ astro`

const cmd = new Command('astro')
cmd
    .option({
        name: 'version',
        alias: 'V',
        type: Boolean,
    })
    .subCommands(
        bcCli,
        newCli,
        initCli
    )
    .usage(cmd.optionsSection())
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
    .onParse(args => {
        if (args.help)
            cmd.printUsage()
        else
            console.log(chalk `Astro {blue 0.1.0}`)
    })

cmd.parse(process.argv.slice(2))