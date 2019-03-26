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
        this._subCommandFunction = new Map
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

            const [command] = args._unknown ? args._unknown : [ '' ]

            if (command === 'help'
             && args._unknown.length === 1) {
                args.help = true
                return args
            }
            else if (command && command[0] !== '-') {
                // Command not eligible after given
                // options.
                for (let k in args) {
                    if (k !== '_unknown') {
                        console.error(`Unknown option: ${args._unknown[0]}`)
                        process.exit(1)
                    }
                }
                const {_subCommandFunction: o} = this
                const f = o.get(command)
                if (f) {
                    const cmd = this._subCommands.get(command)
                    const fArgs = args._unknown.slice(1)
                    const argsF = cmd.parse(fArgs)
                    if (argsF) f(cmd, argsF)
                    return null
                }
                else if (o['#!'])
                    o['#!'](args._unknown.slice(1))
                else {
                    console.error(`Unknown operation: ${command}`)
                    process.exit(1)
                }
            }
            else if (args._unknown) {
                console.error(`Unknown option: ${args._unknown[0]}`)
                process.exit(1)
            }
            else return args
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