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

    // $ 7z x
    , extract     = require('extract-zip')

    // $ rm -rf
    , rimraf      = require('rimraf')

const dataDir = path.join(__dirname, '../../../data')
const compilersDir = path.join(dataDir, 'compilers')

let showCli = null
  , linkCli = null
  , installCli = null
  , uninstallCli = null
  , sealCli = null
  , updateCli = null
  , defaultCli = null
  , useCli = null

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
        // reserved = ['air']
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
        alias: 'f',
        typeLabel: '{underline path}',
        summary: 'Use existing archive',
    })
    .onParse(args => {
        if (args.help)
            installCli.printUsage()

        const {name} = args
        if (!name) {
            display.error('compiler name required')
            process.exit(1)
        }

        const range = semver.validRange(args.ver || '*')
        if (range && astroStorage.lookupCompiler(args.name, range)) {
            console.log('already installed!')
            process.exit(0)
        }

        switch (name) {
            case 'air':
                installAIR(range, args.file)
                break
            default:
                display.error('unknown compiler: ' + name)
                process.exit(1)
        }
    })

function installAIR(range, archive) {
    if (spawnSync('java', ['--help']).error) {
        display.error('JRE not installed')
        // display.error(chalk `JDK must be installed
        //     {cyan tip:} {italic look for openjdk-8}`)
        process.exit(1)
    }

    let compilerPath = ''
      , sdkPath      = ''

    let version = null

    if (archive)
        installNoWeb()
    else {
        request('https://adobe.com/devnet/air/air-sdk-download.html',
        (err, resp, body) => {
            if (err) failedOnVersionFetch(resp)
            webInstall(body)
        })
    }

    function createDirs() {
        compilerPath = path.join(compilersDir, `air-${version.toString()}`)
        sdkPath = path.join(compilerPath, 'sdk')
        if (fs.existsSync(compilerPath))
            rimraf.sync(compilerPath)
        fs.mkdirSync(compilerPath)
        if (!fs.existsSync(sdkPath)) fs.mkdirSync(sdkPath)
    }

    // #1 web-install

    function webInstall(body) {
        version = semver.coerce(body.toString('binary')
            .match(/Compiler \(version\&nbsp\;([^ ]+)/)[1])
        if (!version) failedOnVersionFetch()

        // @todo Previous versions aren't downloadable.
        if (!semver.satisfies(version, range)) {
            display.error('can\'t download given version')
            process.exit(1)
        }

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

    function installNoWeb() {
        if (!fs.existsSync(archive)) {
            display.error('specified archive doesn\'t exist')
            process.exit(1)
        }

        version = semver.coerce('1.99999')
        createDirs()
        extract(archive, { dir: sdkPath, }, finishNoWeb)
    }

    function finishNoWeb(err) {
        if (!err) {
            const readme = fs.readFileSync(
                path.join(sdkPath, 'AIR SDK Readme.txt'), 'binary')
            version = semver.coerce(readme.match(/Adobe AIR ([^ ]+) SDK/)[1])

            fs.renameSync(compilerPath,
                    path.join(compilersDir, `air-${semver.coerce(version)}`))

            if (!semver.satisfies(version, range))
                console.log(chalk `{yellow note:} given version not matched`)
        }

        finishInstall(err)
    }

    // Etc.

    function onFail(error) {
        display.error(chalk `failed downloading SDK
  {cyan status}: ${error.status}`)
        process.exit(1)
    }

    function finishInstall(error) {
        if (error) {
            display.error('failed to extract archive files')
            process.exit(1)
        }

        display.ok(`${display.wrapOkTerm('air')} installed!`)

        const localStorage = astroStorage.localStorage()

        let compilers = null
        const compilersRaw = localStorage.getItem('bc')

        if (!compilers)
            compilers = []
        else
            compilers = JSON.parse(compilersRaw)

        compilers.push({ name: 'air', version: version.toString(), })
        localStorage.setItem('bc', JSON.stringify(compilers))
    }
}

function failedOnVersionFetch() {
    display.error('failed fetching latest version.')
    process.exit(1)
}

/// `bc uninstall` subcommand

uninstallCli = new Command('uninstall')
uninstallCli
    .option({
        name: 'name',
        defaultOption: true ,
    })
    .option({
        name: 'ver',
        alias: 'v',
    })
    .usage(uninstallCli.optionsSection())
    .onParse(args => {
        if (args.help)
            uninstallCli.printUsage()
        const {name, ver: rangeRaw} = args
        if (!name) {
            display.error('compiler name required.')
            process.exit(1)
        }

        const range = semver.validRange(rangeRaw)
        const compilers = astroStorage.compilers()
            .filter(o => o.name === name)

        if (range) {
            for (let i = 0; i !== compilers.length; ++i) {
                const {version: ver} = compilers[i]
                if (semver.compiler.satisfies(ver, range)) {
                    compilers.splice(i, 1)
                    --i
                    rimraf.sync(path.join(compilersDir,
                        `${name}-${ver.toString()}`))
                }
            }
        } else {
            while (compilers.length) {
                const [{version: ver}] = compilers.splice(0, 1)
                rimraf.sync(path.join(compilersDir,
                        `${name}-${ver.toString()}`))
            }
        }

        astroStorage.localStorage().setItem('bc',
            JSON.stringify(compilers))
    })

/// `bc seal` subcommand

sealCli = new Command('seal')
sealCli
    .usage(sealCli.optionsSection())
    .onParse(args => {
        if (args.help)
            sealCli.printUsage()
        console.log('Unimplemented')
    })

/// `bc update` subcommand

updateCli = new Command('update')
updateCli
    .usage(updateCli.optionsSection())
    .onParse(args => {
        if (args.help)
            updateCli.printUsage()
        console.log('Unimplemented')
    })

/// `bc default` subcommand

defaultCli = new Command('default')
defaultCli
    .usage(defaultCli.optionsSection())
    .onParse(args =>
        defaultCli.printUsage())
    .onUnknown(args => {
        

        astroStorage.localStorage().setItem('default_bc', JSON.stringify({
            name: latest.name,
            version: latest.version,
        }))
    })

/// `bc use` subcommand

useCli = new Command('use')
useCli
    .usage(useCli.optionsSection())
    .onParse(args => {
        if (args.help)
            useCli.printUsage()
        console.log('Unimplemented')
    })

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
        installCli,
        uninstallCli,
        sealCli,
        updateCli,
        defaultCli,
        useCli,
    ])
    .onParse(args => cli.printUsage())

module.exports = cli