class Compiler {
    constructor(name, version, isSealed, isLocal) {
        this.name = name
        /// <type SemVer/>
        this.version = version
        this.isSealed = isSealed
        this.isLocal = isLocal
    }
}

module.exports = {
    Compiler,
}