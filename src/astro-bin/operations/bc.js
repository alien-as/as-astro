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
        name: 'file',
        label: 'f',
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
                installAIR(range, args.file)
                break
            default:
                display.error('Unknown compiler: ' + name)
                process.exit(1)
        }
    })

function installAIR(range, archive) {
    if (spawnSync('javac', ['--help']).status) {
        display.error(chalk `{underline JDK} is required.
  {cyan tip:} {italic look for openjdk-8}`)
        process.exit(1)
    }

    let compilerPath = ''
      , sdkPath      = ''

    let version = null

    if (archive) {
        const [archivePath, versionRaw] = archive.split(':')

        if (!(version = semver.valid(versionRaw))) {
            display.error(chalk `
  {cyan help:} specify SDK version as follows:

    {italic $ astro bc install air -f compiler.zip{bold :32.0.0.89}}`)
            process.exit(1)
        }

        if (!semver.satisfies(version, range)) {
            display.error(`Version not satisfied: ${version} ∉ ${range}`)
            process.exit(1)
        }

        if (!fs.existsSync(archivePath)) {
            display.error('Specified archive doesn\'t exist.')
            process.exit(1)
        }

        extract(archivePath, { dir: sdkPath, }, finishArchive)
    }
    else {
        request('https://adobe.com/devnet/air/air-sdk-download.html',
        (err, resp, body) => {
            if (err) failedOnVersionFetch(resp)
            webInstall(body)
        })
    }

    function createDirs() {
        if (!fs.existsSync(compilerPath)) fs.mkdirSync(compilerPath)
        if (!fs.existsSync(sdkPath)) fs.mkdirSync(sdkPath)
    }

    // #1 web-install

    function webInstall(body) {
        ver = semver.coerce(body.toString('binary')
            .match(/Compiler \(version\&nbsp\;([^ ]+)/)[1])
        if (!ver) failedOnVersionFetch()

        // @todo Previous versions aren't downloadable.
        if (!semver.satisfies(ver, range)) {
            display.error('Cannot download given version.')
            process.exit(1)
        }

        // Compiler directory
        compilerPath = path.join(compilersDir, `air-${ver.toString()}`)
        sdkPath = path.join(compilerPath, 'sdk')
        createDirs()

        const bar1 = new cliProgress.Bar({
            format: '[{bar}] {percentage}% | {value}/{total}',
        }, cliProgress.Presets.shades_grey)

        const archivePath = path.join(compilerPath, 'AIRSDK_Compiler.zip')

        // Download archive.
        progress(request.get('http://airdownload.adobe.com/air/win/download/latest/AIRSDK_Compiler.zip')
            .on('response', resp => {
                if (resp.statusCode === 200)
                    bar1.start(resp.headers['content-length'] || 0, 0)
            })
        )
            .on('end', _ => {
                bar1.stop()
                extract(archivePath, { dir: sdkPath, }, err => {
                    if (!err)
                        fs.unlinkSync(arPath)
                    finishInstall(err)
                })
            })
            .on('error', err => {
                bar1.stop()
                onFail(err)
            })
            .on('progress', state => bar1.update(state.size.transferred))
            .pipe(fs.createWriteStream(archivePath))
    }

    // #2 no-web-install

    function installNoWeb(err) {
        if (!err) {
            const readme = fs.readFileSync(
                path.join(sdkPath, 'AIR SDK Readme.txt'), 'binary')
            const [_, innerVer] = readme.match(/Adobe AIR ([^ ]+) SDK/)

            if (innerVer
             && !semver.satisfies(innerVer,
                    semver.validRange(version)))
            {
                console.log(chalk `{cyan help:} given version not matched. Renaming...`)
                fs.renameSync(compilerPath,
                    path.join(compilersDir, `air-${semver.coerce(innerVer)}`))
            }
        }

        finishInstall(err)
    }

    // Etc.

    function onFail(error) {
        display.error(chalk `Failed downloading SDK.
  {cyan status}: ${error.status}`)
        process.exit(1)
    }

    function finishInstall(error) {
        if (error) {
            display.error('Failed to extract archive files.')
            process.exit(1)
        }

        display.ok(`Successfuly installed ${display.wrapOkTerm('air')}`)

        const localStorage = astroStorage.localStorage()

        let compilers = null
        const compilersRaw = localStorage.getItem('bc')

        if (!compilers)
            compilers = []
        else
            compilers = JSON.parse(compilersRaw)

        compilers.push({ name: 'air', version: ver, })
        localStorage.setItem('bc', compilers)
    }
}

function failedOnVersionFetch() {
    display.error('Failed fetching latest version.')
    process.exit(1)
}

/// `bc uninstall` subcommand

uninstallCli = new Command('uninstall')
uninstallCli
    .usage(uninstallCli.optionsSection())
    .onParse(args => {
        if (args.help)
            uninstallCli.printUsage()
        console.log('`uninstall` unimplemented.')
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