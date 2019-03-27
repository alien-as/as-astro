const {LocalStorage} = require('node-localstorage')
const {Compiler} = require('./compiler')
    , {validPackageName} = require('./validation')
const path = require('path')
    , semver = require('semver')

const localStorage = new LocalStorage(path.join(__dirname, '../../data'))

let astroStorage = {
    _compilers: null,
    _defaultCompiler: null,

    compilers() {
        if (!this._compilers) {
            this._compilers = []
            const item = localStorage.getItem('bc')
            const raw = item && JSON.parse(item)

            if (raw) {
                for (let r of raw) {
                    let {name, version, isSealed, isLocal,} = r
                    version = semver.coerce(version)
                    if (!(validPackageName(name) && version))
                        continue
                    this._compilers.push(new Compiler(
                        name, version, !isSealed, !!isLocal))
                }
            }
        }
        return this._compilers
    },
    
    defaultCompiler() {
        if (!this._defaultCompiler) {
            const item = localStorage.getItem('default_bc')
            if (!item) return null
            const {name, version: verRaw} = JSON.parse(item)
            const ver = semver.validRange(verRaw)
            const compilers = this.compilers()
            for (let bc of compilers) {
                if (bc.name === name
                 && semver.satisfies(bc.version, ver))
                {
                    this._defaultCompiler = bc
                    break
                }
            }
        }
        return this._defaultCompiler
    },
}

module.exports = { astroStorage, }