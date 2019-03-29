class Compiler {
    constructor(name, version, isSealed, isLocal) {
        this.name = name
        /// <type SemVer/>
        this.version = version
        this.isSealed = isSealed
        this.isLocal = isLocal
        this._build = null
        this._run = null
        this._test = null
        this._doc = null
    }
}

module.exports = {
    Compiler,
}