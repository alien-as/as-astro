const {Command} = require('@astro-bin/command')
    , structure = require('@astro-bin/structure')
    , display   = require('@astro-bin/display')

const {astroStorage,}     = require('@astro-lib/storage')
    , {validPackageName,} = require('@astro-lib/validation')

const fs          = require('fs')
    , path        = require('path')
    , https       = require('https')
    , {spawnSync} = require('child_process')

const prompts = require('prompts')
    , chalk   = require('chalk')
    , semver  = require('semver')

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

/// `bc install` subcommand

installCli = new Command('install')
installCli
    .usage(installCli.optionsSection())
    .option({
        name: 'name',
        defaultOption: true,
    })
    .option({
        name: 'ver',
        alias: 'v',
        typeLabel: '{underline string}',
        summary: 'Compiler version',
    })
    .option({
        name: 'ar',
        typeLabel: '{underline path}'
        summary: 'Use existing archive',
    })
    .onParse(args => {
        if (args.help)
            installCli.printUsage()

        const {name} = args
        if (!args.name) {
            display.error('Compiler name required.')
            process.exit(1)
        }

        const range = semver.validRange(args.ver || '*')
        if (range && astroStorage.lookupCompiler(args.name, range)) {
            console.log('Already installed!')
            process.exit(0)
        }

        switch (name) {
            case 'air':
                installAIR(range, args.ar)
            default:
                display.error('Unknown compiler: ' + name)
                process.exit(1)
        }
    })

function installAIR(range, ar) {
    if (spawnSync('javac', ['--help']).status) {
        display.error(chalk `It sounds like {underline JDK} isn\'t installed.
  {blue Tip:} {italic prefer openjdk-8}`)
        process.exit(1)
    }

    const p = https.get('https://adobe.com/devnet/air/air-sdk-download.html')
    p
        .on('data', onPageLoad)
        .on('error', failedOnVersionFetch)

    function onPageLoad(data) {
        const [_, ver] = data.match(/Compiler \(version\&nbsp\;([^ ]+)/)
        if (!ver) failedOnVersionFetch()

        // @todo Previous versions aren't downloadable.
        if (!semver.satifies(ver = semver.coerce(ver), range)) {
            display.error('Cannot download given version.')
            process.exit(1)
        }

        
    }

    ...
    ...
    ...
    ...
}

function failedOnVersionFetch() {
    display.error('Failed fetching latest version.')
    process.exit(1)
}

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