require('module-alias/register')

const {Command}   = require('@astro-bin/command')
    ,  interact   = require('@astro-bin/interact')

const chalk = require('chalk')

// Operations
//
const [ bcCli, newCli, initCli, ] = require('./commands/$merged')

/// `$ astro`

const cli = new Command('astro')
cli
    .option({
        name: 'version',
        alias: 'V',
        type: Boolean,
    })
    .subCommands([
        bcCli,
        newCli,
        initCli,
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
    .onParse(args => {
        if (args.help)
            cli.printUsage()
        else
            console.log(chalk `Astro {blue 0.1.0}`)
    })

cli.parse(process.argv.slice(2))