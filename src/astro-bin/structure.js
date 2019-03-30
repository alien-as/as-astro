//! Package structure functions

const {spawnSync} = require('child_process')
    , fs          = require('fs')
    , path        = require('path')

const chalk = require('chalk')

const {stringFormat} = require('@extension/string')
const display        = require('@astro-bin/display')

/// Initialize package directory.
///
function init(basePath, name, kind) {
	const baseDirIndex = basePath.length + 1

    // `.git` data
    if (!fs.existsSync(path.join(basePath, '.git'))) {
        // $ git init
        spawnSync('git', ['init'], { cwd: basePath, })
    }

    // Write `.gitignore`
    const gitIgnorePath = path.join(basePath, '.gitignore')
    if (!fs.existsSync(gitIgnorePath))
        fs.writeFileSync(gitIgnorePath, '/target\n/astro.lock')

    // Remains intact with a `astro.toml`.
    const configPath = path.join(basePath, 'astro.toml')
    if (fs.existsSync(configPath))
        process.exit(0)

    const author = gitGlobalUser()

    let sources = []
    captureScriptDirs(sources, basePath)

    /// Write `main.as` or `lib.as` file.
    if (!sources.length) {
        const srcPath = path.join(basePath, 'src')
        fs.mkdirSync(srcPath)
        const srcFile = kind === 'bin'
            ? 'main.as' : 'lib.as'
        let f = fs.readFileSync(path.join(__dirname, `assets/${srcFile}`),
            { encoding: 'utf-8' })

        // Define at package name
        if (kind === 'lib' && name[0] > '9')
            f = stringFormat(f, name.replace(/\-/g, '_') + ' ')
        else
            f = stringFormat(f, '')

        fs.writeFileSync(path.join(srcPath, srcFile), f)
        sources.push(path.join(srcPath, srcFile))
    }

    const rawSources = sources.map(p => includeDir(p.slice(baseDirIndex))).join(', ')

    // Write `astro.toml`
    const cfg = fs.readFileSync(path.join(__dirname,
        'assets/astro.toml'), { encoding: 'utf-8' })
    fs.writeFileSync(configPath, stringFormat(cfg,
        name, author, kind, rawSources))
}

// Looks for directories containing
// .as with `**` globbing.
//
function captureScriptDirs(dest, p) {
	const sub = []
    let pushed = false

    for (let p2 of fs.readdirSync(p)) {
        if (p2 === '.git') continue
        p2 = path.resolve(p, p2)
        if (fs.lstatSync(p2).isDirectory()) {
            const dest = []
            captureScriptDirs(dest, p2)
            sub.push(dest)
        }
        else if (path.parse(p2).ext === '.as') {
            dest.push(path.join(p, './**'))
            return
        }
    }

    for (let ls of sub) {
        for (let p of ls)
            dest.push(p)
    }
}

const includeReplaces = {
    "'": '%27',
    '\\': '/',
}

function includeDir(p) {
    return `'${p.replace(/(['\\])/g, (_, s) => includeReplaces[s])}'`
}

function gitGlobalUser() {
    const r1 = retrieveGitGlobalKey('user.name')
        , r2 = retrieveGitGlobalKey('user.email')
    if (r1.status) {
        display.error('failed to execute Git; ' +
            "if you haven'nt it installed, please browse:\n  " +
            chalk `{cyan {underline https://git-scm.com/downloads}}`)
        process.exit(1)
    }

    const name = r1.stdout.replace(/[\n\r]/g, '')
        , email = r2.stdout.replace(/[\n\r]/g, '')

    if (!name || !email) {
        display.error(`missing user info; try these commands:\n
  $ git config --global user.name nickname
  $ git config --global user.email email\n`)
        process.exit(1)
    }
    
    return `${name} <${email}>`
}

function retrieveGitGlobalKey(k) {
    return spawnSync('git', ['config', '--global', '--get', k],
        { encoding: 'utf-8' })
}

module.exports = {
    init,
}