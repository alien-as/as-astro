const {spawnSync} = require('child_process')
const fs = require('fs')
    , path = require('path')
const chalk = require('chalk')

function init(basePath, name, kind) {
    if (!fs.existsSync(path.join(basePath, '.git'))) {
        // $ git init
        spawnSync('git', ['init'], { cwd: basePath, })
    }

    const configPath = path.join(basePath, 'astro.toml')
    if (fs.existsSync(configPath))
        return

    const author = gitGlobalUser()

    let src = []
    captureScriptDirs(src, basePath)

    if (!src.length && kind === 'bin') {
        const srcPath = path.join(basePath, 'src')
        fs.mkdirSync(srcPath)
        fs.writeFileSync(path.join(srcPath, 'main.as'), `\
package {
    public function main(): void {
        trace('Hello, Astro!')
    }
}\
`)
        src.push('src/main.as')
    }

    const baseDirIndex = basePath.length

    fs.writeFileSync(configPath, `\
[package]
name = '${name}'
version = '0.1.0'
authors = ['${author}']

[dependencies]

[${kind}]
include = [${src.map(p => includeDir(p.slice(baseDirIndex))).join(', ')}]\
`)

    const gitIgnorePath = path.join(basePath, '.gitignore')
    if (!fs.existsSync(gitIgnorePath))
        fs.writeFileSync(gitIgnorePath, `\
/target
/astro.lock`)
}

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
        console.error(`Failed to execute Git. \
If you haven'nt it installed, consult:\n\
 ${chalk.cyan('https://git-scm.com/downloads')}`)
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

module.exports = { init, }