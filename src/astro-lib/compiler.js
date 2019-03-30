const builtins = ['air']

/// @abstract
class Compiler {
    static isBuiltin(name) {
        return builtins.indexOf(name) !== -1
    }

    constructor(name, version) {
        this.name = name
        /// <type SemVer/>
        this.version = version
        this.isSealed = false
        this._cliScript = ''
        this._build = null
        this._run = null
        this._test = null
        this._doc = null
    }

    // ## Abstract

    execCommand(argv) {}
    execBuild(options) {}
    execRun(options) {}
    execTest(options) {}
    execDoc(options) {}
}

class BuiltinCommand extends Command {
    constructor(name, version) {
        super(name, version)
    }
}

class CustomCommand extends Command {
    constructor(name, version) {
        super(name, version)
    }
} 

module.exports = {
    Compiler,
    BuiltinCommand,
    CustomCommand,
}