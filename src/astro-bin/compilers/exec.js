//! Execute default compiler on given package.

const {Command} = require('@astro-bin/cli')
    , structure = require('@astro-bin/structure')
    , clfmt = require('@astro-bin/console-format')
const {astroStorage} = require('@astro-lib/storage')
const fs = require('fs')
    , path = require('path')
const prompts = require('prompts')
    , chalk = require('chalk')

const air = require('./air')
    , redtam = require('./redtam')

module.exports = {
    execBuild() {
        ...
    },

    execRun() { ... },

    execDoc() { ... },

    _execCompiler() {
        const bc = astroStorage.defaultCompiler()
        if (!bc) {
            clfmt.error('No compiler specified.\n'
                + chalk ``)???
            process.exit(1)
        }
        ...
    },
}