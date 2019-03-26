const {spawnSync} = require('child_process')
const fs = require('fs')
    , path = require('path')

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

    fs.writeFileSync(configPath, `\
[package]
name = '${name}'
version = '0.1.0'
authors = ['${author}']

[dependencies]

[${kind}]
include = [${src.map(includeDir).join(', ')}]\
`)

    const gitIgnorePath = path.join(basePath, '.gitignore')
    if (!fs.existsSync(gitIgnorePath))
        fs.writeFileSync(gitIgnorePath, `\
/target
/astro.lock`)
}

function captureScriptDirs(dest, p) {
    let pushed = false
    for (let f of fs.readdirSync(p)) {
        if (fs.statSync(f).isDirectory())
            captureScriptDirs(dest, f)
        else if (path.parse(f).ext === '.as') {
            if (pushed) continue
            dest.push(path.join(p, '%2A%2A'))
            pushed = true
        }
    }
}

function includeDir(p) {
    return `'${p.replace(/'/g, '%27')}'`
}

function gitGlobalUser() {
    const r1 = retrieveGitGlobalKey('user.name')
        , {stdout: email} = retrieveGitGlobalKey('user.email')
    if (r1.status) {
        console.error('Failed to execute Git. If you haven\'nt it installed, see:\n\
  ')
        process.exit(1)
    }

    const {stdout: name} = r1

    if (!name || !email) {
        console.error(`Please enter Git user info.\n
  $ git config --global user.name nickname
  $ git config --global user.email email\n`)
        process.exit(1)
    }
}

function retrieveGitGlobalKey(k) {
    return spawnSync('git', ['config', '--global', '--get', k])
}

module.exports = { init, }