const {Command} = require('@astro-bin/command')
    , structure = require('@astro-bin/structure')
    , display = require('@astro-bin/display')
const {astroStorage,} = require('@astro-lib/storage')
const fs = require('fs')
    , path = require('path')
const prompts = require('prompts')
    , chalk = require('chalk')

let showCli = null
  , linkCli = null
  , installCli = null
  , uninstallCli = null
  , sealCli = null
  , updateCli = null
  , defaultCli = null

/// `bc show` subcommand

showCli = new Command('show')
showCli
    .usage(showCli.optionsSection())
    .onParse(args => {
        if (args.help)
            showCli.printUsage()
        const defaultBc = astroStorage.defaultCompiler()
        for (let bc of astroStorage.compilers())
            console.log(chalk `{cyan -} ${bc.name} {gray (${bc.version})}`
                + ((bc === defaultBc) ? chalk ` {cyan \xABdefault\xBB}` : ''))
    })


/// `bc link` subcommand

linkCli = new Command('link')
linkCli
    .usage(linkCli.optionsSection())
    .onParse(args => {
        if (args.help)
            linkCli.printUsage()
        display.error(chalk `{red \`link\`} command unavailable`)
        process.exit(1)
    })

/*
/// `bc XXX` subcommand

xxxCli = new Command('XXX')
xxxCli
    .usage({
        header: 'Does?',
        content: `{italic \
$ astro bc xxx
$ astro bc xxx
$ astro bc xxx}`,
    })
    .usage(xxxCli.optionsSection())
    .onParse(args => {
        if (args.help)
            xxxCli.printUsage()
    })

/// `bc XXX` subcommand

xxxCli = new Command('XXX')
xxxCli
    .usage({
        header: 'Does?',
        content: `{italic \
$ astro bc xxx
$ astro bc xxx
$ astro bc xxx}`,
    })
    .usage(xxxCli.optionsSection())
    .onParse(args => {
        if (args.help)
            xxxCli.printUsage()
    })

/// `bc XXX` subcommand

xxxCli = new Command('XXX')
xxxCli
    .usage({
        header: 'Does?',
        content: `{italic \
$ astro bc xxx
$ astro bc xxx
$ astro bc xxx}`,
    })
    .usage(xxxCli.optionsSection())
    .onParse(args => {
        if (args.help)
            xxxCli.printUsage()
    })

/// `bc XXX` subcommand

xxxCli = new Command('XXX')
xxxCli
    .usage({
        header: 'Does?',
        content: `{italic \
$ astro bc xxx
$ astro bc xxx
$ astro bc xxx}`,
    })
    .usage(xxxCli.optionsSection())
    .onParse(args => {
        if (args.help)
            xxxCli.printUsage()
    })

/// `bc XXX` subcommand

xxxCli = new Command('XXX')
xxxCli
    .usage({
        header: 'Does?',
        content: `{italic \
$ astro bc xxx
$ astro bc xxx
$ astro bc xxx}`,
    })
    .usage(xxxCli.optionsSection())
    .onParse(args => {
        if (args.help)
            xxxCli.printUsage()
    })

/// `bc XXX` subcommand

xxxCli = new Command('XXX')
xxxCli
    .usage({
        header: 'Does?',
        content: `{italic \
$ astro bc xxx
$ astro bc xxx
$ astro bc xxx}`,
    })
    .usage(xxxCli.optionsSection())
    .onParse(args => {
        if (args.help)
            xxxCli.printUsage()
    })

/// `bc XXX` subcommand

xxxCli = new Command('XXX')
xxxCli
    .usage({
        header: 'Does?',
        content: `{italic \
$ astro bc xxx
$ astro bc xxx
$ astro bc xxx}`,
    })
    .usage(xxxCli.optionsSection())
    .onParse(args => {
        if (args.help)
            xxxCli.printUsage()
    })

/// `bc XXX` subcommand

xxxCli = new Command('XXX')
xxxCli
    .usage({
        header: 'Does?',
        content: `{italic \
$ astro bc xxx
$ astro bc xxx
$ astro bc xxx}`,
    })
    .usage(xxxCli.optionsSection())
    .onParse(args => {
        if (args.help)
            xxxCli.printUsage()
    })

/// `bc XXX` subcommand

xxxCli = new Command('XXX')
xxxCli
    .usage({
        header: 'Does?',
        content: `{italic \
$ astro bc xxx
$ astro bc xxx
$ astro bc xxx}`,
    })
    .usage(xxxCli.optionsSection())
    .onParse(args => {
        if (args.help)
            xxxCli.printUsage()
    })
*/

/// `bc` subcommand

const cli = new Command('bc')
cli
    .usage({
        header: 'Examples',
        content: `{italic \
$ astro bc show {gray # Shows installed compilers}
$ astro bc install adobe-air {gray # Installs AIR SDK}
$ astro bc update {gray # Updates installed compilers}}`,
    })
    .usage({
        header: 'Operations',
        content: [
            { name: 'show', summary: 'Shows installed compilers' },
            { name: 'link', summary: 'Installs given custom compiler' },
            { name: 'install', summary: 'Installs given compiler' },
            { name: 'uninstall', summary: 'Uninstalls compiler' },
            { name: 'seal', summary: 'Seals compiler version' },
            { name: 'update', summary: 'Updates compilers' },
            { name: 'default', summary: 'Set default compiler' },
        ],
    })
    .subCommands([
        showCli,
        linkCli, /*
        installCli,
        uninstallCli,
        sealCli,
        updateCli
        defaultCli */
    ])
    .onParse(args => cli.printUsage())

module.exports = cli