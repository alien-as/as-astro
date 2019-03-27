const {Command} = require('@astro-bin/cli')
    , structure = require('@astro-bin/structure')
    , clfmt = require('@astro-bin/console_format')
const fs = require('fs')
    , path = require('path')
const prompts = require('prompts')

let showCmd = null
  , linkCmd = null
  , installCmd = null
  , uninstallCmd = null
  , sealCmd = null
  , updateCmd = null

/// `bc show` subcommand

showCmd = new Command('show')
showCmd
    .usage(showCmd.optionsSection())
    .onParse(args => {
        if (args.help)
            showCmd.printUsage()
        // ...
    })

/*
/// `bc XXX` subcommand

xxxCmd = new Command('XXX')
xxxCmd
    .usage({
        header: 'Does?',
        content: `{italic \
$ astro bc xxx
$ astro bc xxx
$ astro bc xxx}`,
    })
    .usage(xxxCmd.optionsSection())
    .onParse(args => {
        if (args.help)
            xxxCmd.printUsage()
    })

/// `bc XXX` subcommand

xxxCmd = new Command('XXX')
xxxCmd
    .usage({
        header: 'Does?',
        content: `{italic \
$ astro bc xxx
$ astro bc xxx
$ astro bc xxx}`,
    })
    .usage(xxxCmd.optionsSection())
    .onParse(args => {
        if (args.help)
            xxxCmd.printUsage()
    })

/// `bc XXX` subcommand

xxxCmd = new Command('XXX')
xxxCmd
    .usage({
        header: 'Does?',
        content: `{italic \
$ astro bc xxx
$ astro bc xxx
$ astro bc xxx}`,
    })
    .usage(xxxCmd.optionsSection())
    .onParse(args => {
        if (args.help)
            xxxCmd.printUsage()
    })

/// `bc XXX` subcommand

xxxCmd = new Command('XXX')
xxxCmd
    .usage({
        header: 'Does?',
        content: `{italic \
$ astro bc xxx
$ astro bc xxx
$ astro bc xxx}`,
    })
    .usage(xxxCmd.optionsSection())
    .onParse(args => {
        if (args.help)
            xxxCmd.printUsage()
    })

/// `bc XXX` subcommand

xxxCmd = new Command('XXX')
xxxCmd
    .usage({
        header: 'Does?',
        content: `{italic \
$ astro bc xxx
$ astro bc xxx
$ astro bc xxx}`,
    })
    .usage(xxxCmd.optionsSection())
    .onParse(args => {
        if (args.help)
            xxxCmd.printUsage()
    })

/// `bc XXX` subcommand

xxxCmd = new Command('XXX')
xxxCmd
    .usage({
        header: 'Does?',
        content: `{italic \
$ astro bc xxx
$ astro bc xxx
$ astro bc xxx}`,
    })
    .usage(xxxCmd.optionsSection())
    .onParse(args => {
        if (args.help)
            xxxCmd.printUsage()
    })

/// `bc XXX` subcommand

xxxCmd = new Command('XXX')
xxxCmd
    .usage({
        header: 'Does?',
        content: `{italic \
$ astro bc xxx
$ astro bc xxx
$ astro bc xxx}`,
    })
    .usage(xxxCmd.optionsSection())
    .onParse(args => {
        if (args.help)
            xxxCmd.printUsage()
    })

/// `bc XXX` subcommand

xxxCmd = new Command('XXX')
xxxCmd
    .usage({
        header: 'Does?',
        content: `{italic \
$ astro bc xxx
$ astro bc xxx
$ astro bc xxx}`,
    })
    .usage(xxxCmd.optionsSection())
    .onParse(args => {
        if (args.help)
            xxxCmd.printUsage()
    })

/// `bc XXX` subcommand

xxxCmd = new Command('XXX')
xxxCmd
    .usage({
        header: 'Does?',
        content: `{italic \
$ astro bc xxx
$ astro bc xxx
$ astro bc xxx}`,
    })
    .usage(xxxCmd.optionsSection())
    .onParse(args => {
        if (args.help)
            xxxCmd.printUsage()
    })

/// `bc XXX` subcommand

xxxCmd = new Command('XXX')
xxxCmd
    .usage({
        header: 'Does?',
        content: `{italic \
$ astro bc xxx
$ astro bc xxx
$ astro bc xxx}`,
    })
    .usage(xxxCmd.optionsSection())
    .onParse(args => {
        if (args.help)
            xxxCmd.printUsage()
    })
*/

/// `bc` subcommand

const cmd = new Command('bc')
cmd
    .usage({
        header: 'Examples',
        content: `{italic \
$ astro bc show {gray # Shows installed compilers}
$ astro bc install adobe-air {gray # Installs AIR SDK}
$ astro bc update {gray # Updates installed compilers}}`,
    })
    .option({
        name: 'name',
    })
    .subCommands(
        showCmd /*
        linkCmd,
        installCmd,
        uninstallCmd,
        sealCmd,
        updateCmd */
    )
    .onParse(args => cmd.printUsage())

module.exports = cmd