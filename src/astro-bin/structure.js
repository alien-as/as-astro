const gitUserInfo = require('git-user-info')
const fs = require('fs')
    , path = require('path')

function init(basePath, name, kind) {
    fs.mkdir(path)

    const user = gitUserInfo()
    if (!user || !user.name || !user.email) {
        console.error(`Please enter Git user info.\n
  $ git config --global user.name nickname
  $ git config --global user.email email\n`)
        process.exit(1)
    }

    let author = `${user.name} <${user.email}>`

    let src = []
    captureScriptDirs(src, basePath)

    fs.writeFile(path.join(basePath, 'astro.toml'), `\
[package]
name = '${name}'
version = '0.1.0'
authors = ['${author}']

[dependencies]

[${kind}]
include = [${src.map(s => `'${s.replace(/\'/g, '%27'}'`).join(', ')}]\
`)
}

function captureScriptDirs(dest, p) {
    let pushed = false
    for (let f of fs.readdirSync(p)) {
        if (fs.statSync(f).isDirectory())
            captureScriptDirs(dest, f)
        else if (path.parse(f).ext === '.as') {
            if (pushed) continue
            dest.push(path.join(p, '%2A'))
            pushed = true
        }
    }
}

module.exports = { init, }