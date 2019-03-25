//! One-object form for
//! `command-line-args` and
//! `command-line-usage`.

const commandLineArgs = require('command-line-args')
    , commandLineUsage = require('command-line-usage')

class Command {
    constructor(name) {
        this.name = name
        this._options = []
        this._usage = []
        this._subCommands = null
    }

    subCommand(command) {
        if (!this._subCommands)
            this._subCommands = new Map
        this._subCommands.set(command.name, command)
    }

    /// <chainable/>
    ///
    usage(section) {
        this._usage.push(section)
    }

    optionsSection() {
        return {
            header: 'Options',
            optionList: this._options,
        }
    }

    option(option) {
        this._options.push(option)
        return this
    }

    parse(argv) {
        try {
            ...
        } catch (e) {
            console.error(e.message)
            process.exit(1)
        }
    }

    getUsage() {
        ...
    }
}

module.exports = { Command, }