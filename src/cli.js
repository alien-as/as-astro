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
                type: Boolean,
            }
        ]
        this._usage = []
        this._subCommands = null
        this._subCommandFunction = new Map
    }

    subCommand(command) {
        if (!this._subCommands) {
            this._subCommands = new Map
            this._options.push({
                name: '__command',
                defaultOption: true,
            })
        }
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
            hide: '__command',
        }
    }

    option(option) {
        this._options.push(option)
        return this
    }

    /// Maps functions to matched sub-commands.
    ///
    /// A `'#!'`-key property is treated
    /// specially. It'll be called as `f(name)`
    /// if a given sub-command doesn't exist.
    ///
    subCommandFunction(o) {
        for (let k in o)
            this._subCommandFunction.set(k, o[k])
        return this
    }

    parse(argv) {
        try {
            const args = commandLineArgs(this._options,
                { argv, stopAtFirstUnknown: true })
            const {__command: command} = args
            if (command) {
                if (command === 'help')
                    this.printUsage()
                const {_subCommandFunction: o} = this
                const f = o.get(command)
                if (f) {
                    const cmd = this._subCommands.get(command)
                    const args2 = cmd.parse(args._unknown || [])
                    if (args2) f(args2)
                    return null
                }
                else if (o['#!'])
                    o['#!'](args._unknown)
                else {
                    console.error(`Unknown operation: ${command}`)
                    process.exit(1)
                }
            } else if (args._unknown) {
                console.error(`Unknown option: ${args._unknown[0]}`)
                process.exit(1)
            } else if (args.help) {
                this.printUsage()
            } else return args
        } catch (e) {
            console.error(e.message)
            process.exit(1)
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