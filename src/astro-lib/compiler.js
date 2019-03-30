class Compiler {
    constructor(name, version) {
        this.name = name
        /// <type SemVer/>
        this.version = version
        this.isSealed = false
        this.cliScript = ''
        this._build = null
        this._run = null
        this._test = null
        this._doc = null
    }
}

module.exports = {
    Compiler,
}