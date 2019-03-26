//! One-object form for
//! `command-line-args` and
//! `command-line-usage`.

const commandLineArgs = require('command-line-args')
    , commandLineUsage = require('command-line-usage')

class Command {
    constructor(name) {
        this.name = name
        this._options = [
            {
                name: 'help',
                alias: 'h',
                type: Boolean,
            }
        ]
        this._usage = []
        this._subCommands = null
        this._onParse = null
        this._onUnknown = null
    }

    subCommand(command) {
        if (!this._subCommands)
            this._subCommands = new Map
        this._subCommands.set(command.name, command)
        return this
    }

    /// <chainable/>
    ///
    usage(section) {
        this._usage.push(section)
        return this
    }

    optionsSection() {
        return {
            header: 'Options',
            optionList: this._options,
            hide: ['help']
        }
    }

    option(option) {
        this._options.push(option)
        return this
    }

    onParse(f) {
        this._onParse = f
        return this
    }

    /// Event invoked as `f(name)`
    /// when a given sub-command doesn't exist.
    ///
    onUnknown(f) {
        this._onUnknown = f
        return this
    }

    parse(argv) {
        let args = null
 
       try {
            args = commandLineArgs(this._options,
                { argv, stopAtFirstUnknown: true })
        } catch (e) {
            console.error(e.message)
            process.exit(1)
        }

        const [command] = args._unknown ? args._unknown : [ '' ]

        if (command === 'help'
         && args._unknown.length === 1) {
            args.help = true
            if (this._onParse)
                this._onParse(args)
            return true
        }
        else if (command && command[0] !== '-') {
            // Command not allowed after given
            // options.
            for (let k in args) {
                if (k !== '_unknown') {
                    console.error(`Unknown option: ${args._unknown[0]}`)
                    process.exit(1)
                }
            }
            const cmd = this._subCommands
                ? this._subCommands.get(command): null
            if (cmd) {
                const args2 = args._unknown.slice(1)
                cmd.parse(args2)
                return false
            }
            else if (this._onUnknown)
                this._onUnknown(args._unknown.slice(1))
            else {
                console.error(`Unknown operation: ${command}`)
                process.exit(1)
            }
        }
        else if (args._unknown) {
            console.error(`Unknown option: ${args._unknown[0]}`)
            process.exit(1)
        }
        else {
            if (this._onParse)
                this._onParse(args)
            return true
        }
    }

    usageString() {
        return commandLineUsage(this._usage)
    }

    printUsage() {
        console.log(this.usageString())
        process.exit(0)
    }
}

module.exports = { Command, }