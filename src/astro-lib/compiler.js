class Compiler {
    static _construct(path, version, local) {
        this.path = path
        this.version = version
        
        /// Indicates whether the compiler
        /// is version-sealed.
        this.sealed = false

        /// Local to online registry?
        this.local = local
    }
}

module.exports = {
    Compiler,
}