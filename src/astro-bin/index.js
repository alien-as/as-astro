require('module-alias/register')

const {Command} = require('@astro-bin/cli')
    , structure = require('@astro-bin/structure')
    , clfmt = require('@astro-bin/console_format')
const {
    bcCmd,
    newCmd, initCmd,
} = require('./ops')

/// `$ astro`
const cmd = new Command('astro')
cmd
    .option({
        name: 'version',
        alias: 'V',
        type: Boolean,
    })
    .subCommand(bcCmd)
    .subCommand(newCmd)
    .subCommand(initCmd) /*
    .subCommand()
    .subCommand()
    .subCommand()
    .subCommand()
    .subCommand()
    .subCommand()
    .subCommand()
    .subCommand()
    .subCommand() */
    .usage(cmd.optionsSection())
    .usage({
        header: 'Operations',
        content: [
            {
                name: 'bc',
                summary: 'Manages compilers'
            },
            {
                name: 'new',
                summary: 'Creates package at new directory',
            },
            {
                name: 'init',
                summary: 'Initializes package',
            }, /*
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
            }, */
        ],
    })
    .onParse(args => {
        if (args.help)
            cmd.printUsage()
        else
            console.log('Astro FOXL9')
    })

cmd.parse(process.argv.slice(2))