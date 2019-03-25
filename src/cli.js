//! Abstraction over
//! `command-line-args` and
//! `command-line-usage`.

const commandLineArgs = require('command-line-args')
    , commandLineUsage = require('command-line-usage')

class Command {
    constructor() {
        this._options = []
        this._helpSections = []
    }

    /// <chainable/>
    ///
    helpSections(...sections) {
        for (let sec of sections)
            this._helpSections.push(sec)
    }

    option(option) {
        this._options.push(option)
        return this
    }

    optionsSection() {
        return {
            header: 'Options',
            optionList: this._options,
        }
    }
}

module.exports = { Command, }