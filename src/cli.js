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
        this._subCommandOperation = new Map
    }

    subCommand(command) {
        if (!this._subCommands) {
            this._subCommands = new Map
            this._options.push({
                name: '__command',
                defaultValue: true,
            })
        }
        this._subCommands.set(command.name, command)
    }

    /// <chainable/>
    ///
    usage(section) {
        if (section.optionList)
            section.hide = '__command'
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

    /// Maps operations to matched sub-commands.
    ///
    /// A `'#!'`-key property is treated
    /// specially. It'll be called as `f(name)`
    /// if a given sub-command doesn't exist.
    ///
    subCommandOperation(o) {
        for (let k in o)
            this._subCommandOperations.set(k, o[k])
    }

    parse(argv) {
        try {
            const args = commandLineArgs(this._options,
                { argv, stopAtFirstUnknown: true })
            const {__command: command} = args
            if (command) {
                if (command === 'help')
                    this.printUsage()
                const f = o[command]
                if (f) {
                    const cmd = this._subCommands.get(command)
                    return cmd.parse(args._unknown)
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