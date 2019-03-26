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
    let src = ['']
    
    // Find root .as paths
    ???

    fs.writeFile(basePath.join, `\
[package]
name = '${name}'
version = '0.1.0'
authors = ['${author}']

[dependencies]

[${kind}]
${src}\
`)
}

module.exports = { init, }