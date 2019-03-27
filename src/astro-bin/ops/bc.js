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
    })/*
    .subCommand(showCmd)
    .subCommand(linkCmd)
    .subCommand(installCmd)
    .subCommand(uninstallCmd)
    .subCommand(sealCmd)
    .subCommand(updateCmd)*/
    .onParse(args => cmd.printUsage())

module.exports = cmd

/// `bc XXX` subcommand

const xxxCmd = new Command('XXX')
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

const xxxCmd = new Command('XXX')
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

const xxxCmd = new Command('XXX')
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

const xxxCmd = new Command('XXX')
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

const xxxCmd = new Command('XXX')
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

const xxxCmd = new Command('XXX')
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

const xxxCmd = new Command('XXX')
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

const xxxCmd = new Command('XXX')
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

const xxxCmd = new Command('XXX')
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

const xxxCmd = new Command('XXX')
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

const xxxCmd = new Command('XXX')
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