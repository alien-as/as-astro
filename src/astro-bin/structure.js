const {spawnSync} = require('child_process')
const fs = require('fs')
    , path = require('path')
const chalk = require('chalk')
const {stringFmt} = require('./utils')

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

    /// Write `main.as` file.
    if (!sources.length && kind === 'bin') {
        const srcPath = path.join(basePath, 'src')
        fs.mkdirSync(srcPath)
        const f = fs.readFileSync(path.join(__dirname, 'assets/main.as'), { encoding: 'utf-8' })
        fs.writeFileSync(path.join(srcPath, 'main.as'), f)
        sources.push(path.join(srcPath, 'main.as'))
    }

    const rawSources = sources.map(p => includeDir(p.slice(baseDirIndex))).join(', ')

    // Write `astro.toml`
    const cfg = fs.readFileSync(path.join(__dirname,
        'assets/astro.toml'), { encoding: 'utf-8' })
    fs.writeFileSync(configPath, stringFmt(cfg,
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

function includeDir(p) {
    return `'${p.replace(/'/g, '%27')}'`
}

function gitGlobalUser() {
    const r1 = retrieveGitGlobalKey('user.name')
        , r2 = retrieveGitGlobalKey('user.email')
    if (r1.status) {
        console.error('Failed to execute Git. ' +
            "If you haven'nt it installed, consult:\n  " +
            chalk.cyan('https://git-scm.com/downloads'))
        process.exit(1)
    }

    const name = r1.stdout.replace(/[\n\r]/g, '')
        , email = r2.stdout.replace(/[\n\r]/g, '')

    if (!name || !email) {
        console.error(`Missing user info.\n
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