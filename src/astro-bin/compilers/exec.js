//! Get compiler execution model.
//!
//! ```
//! interface CompilerExec {
//!     build (pkg: AstroPackage, options: BuildOptions)
//!     run   (pkg: AstroPackage, options: BuildOptions)
//!     test  (pkg: AstroPackage, options: BuildOptions)
//!     doc   (pkg: AstroPackage, options: DocOptions)
//! }
//!
//! class BuildOptions {
//!     var optimise: uint?
//!       , target: string?
//!       , targetDir: string?
//!       , features: Vector.<string>
//! }
//!
//! class DocOptions {
//!     var targetDir: string?
//! }
//!
//!
//! ```

const {Command} = require('@astro-bin/cli')
    , structure = require('@astro-bin/structure')
    , clfmt     = require('@astro-bin/console-format')

const {astroStorage} = require('@astro-lib/storage')

const fs   = require('fs')
    , path = require('path')

const prompts = require('prompts')
    , chalk   = require('chalk')

const air    = require('./air')
    , redtam = require('./redtam')

module.exports = {
    getCompiler() {
        const bc = astroStorage.defaultCompiler()
        if (!bc) {
            clfmt.error('No compiler specified.\n'
                + chalk `{italic $ astro bc default <compiler>}`)
            process.exit(1)
        }
        if (bc.isLocal) {
            ...
        } else {
            clfmt.error('Custom compilers unimplemented')
            process.exit(1)
        }
    },
}