const {Command} = require('@astro-bin/command')
    , structure = require('@astro-bin/structure')
    , display   = require('@astro-bin/display')

const {astroStorage,}     = require('@astro-lib/storage')
    , {validPackageName,} = require('@astro-lib/validation')

const fs          = require('fs')
    , path        = require('path')
    , request     = require('request')
    , {spawnSync} = require('child_process')

const prompts     = require('prompts')
    , chalk       = require('chalk')
    , semver      = require('semver')
    , progress    = require('request-progress')
    , cliProgress = require('cli-progress')
    , extract     = require('extract-zip')

const dataDir = path.join(__dirname, '../../../data')
const compilersDir = path.join(dataDir, 'compilers')

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
        typeLabel: '{underline path}',
        summary: 'Use existing archive',
    })
    .onParse(args => {
        if (args.help)
            installCli.printUsage()

        const {name} = args
        if (!name) {
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
                break
            default:
                display.error('Unknown compiler: ' + name)
                process.exit(1)
        }
    })

function installAIR(range, ar) {
    if (spawnSync('javac', ['--help']).status) {
        display.error(chalk `{underline JDK} is required.
  {cyan tip:} {italic look for openjdk-8}`)
        process.exit(1)
    }

    request('https://adobe.com/devnet/air/air-sdk-download.html',
        (err, resp, body) => {
            if (err) failedOnVersionFetch(resp)
            onPageLoad(body)
        })

    let compilerPath = ''
      , sdkPath      = ''

    function onPageLoad(body) {
        const ver = semver.coerce(body.toString('binary').match(/Compiler \(version\&nbsp\;([^ ]+)/)[1])
        if (!ver) failedOnVersionFetch()

        // @todo Previous versions aren't downloadable.
        if (!semver.satisfies(ver, range)) {
            display.error('Cannot download given version.')
            process.exit(1)
        }

        compilerPath = path.join(compilersDir,
            `air-${ver.toString()}`)
        sdkPath = path.join(compilerPath, 'sdk')

        // Create internal directory
        if (!fs.existsSync(compilerPath))
            fs.mkdirSync(compilerPath)
        if (!fs.existsSync(sdkPath))
        fs.mkdirSync(sdkPath)

        if (ar) {
            if (!fs.existsSync(ar)) {
                display.error('Specified archive doesn\'t exist.')
                process.exit(1)
            }

            extract(ar, { dir: sdkPath, }, onExtract)
        }
        else {
            const bar1 = new cliProgress.Bar({
                format: '[{bar}] {percentage}% | {eta} | {value}/{total}',
            }, cliProgress.Presets.shades_grey)

            // Download archive.
            progress(request.get('http://airdownload.adobe.com/air/win/download/latest/AIRSDK_Compiler.zip')
                .on('response', resp => {
                    if (resp.statusCode === 200)
                        bar1.start(resp.headers['content-length'] || 0, 0)
                })
            )
                .on('end', _ => {
                    bar1.stop()
                    extract(ar, { dir: sdkPath, }, err => {
                        if (!err)
                            fs.unlinkSync(arPath)
                        onExtract(err)
                    })
                })
                .on('error', e => {
                    bar1.stop()
                    onFail(e)
                })
                .on('progress', state => bar1.update(state.size.transferred))
                .pipe(fs.createWriteStream(path.join(compilerPath, 'AIRSDK_Compiler.zip')))
        }
    }
    
    function onFail(error) {
        display.error(chalk `Failed downloading SDK.
  {cyan status}: ${error.status}`)
        process.exit(1)
    }
    
    function onExtract(error) {
        if (error) {
            display.error('Failed to extract archive files.')
            process.exit(1)
        }

        display.ok(`Successfuly installed ${display.wrapOkTerm('air')}`)
    }
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
        linkCli,
        installCli, /*
        uninstallCli,
        sealCli,
        updateCli
        defaultCli */
    ])
    .onParse(args => cli.printUsage())

module.exports = cli