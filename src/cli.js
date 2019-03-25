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
        this._subCommandOperation = new Map
    }

    subCommand(command) {
        if (!this._subCommands)
            this._subCommands = new Map
        this._subCommands.set(command.name, command)
    }

    /// <chainable/>
    ///
    usage(section) {
        if (section.optionList)
            section.hide = 'command'
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

    parse() {
        try {
            const args = commandLineArgs(this._options,
                { stopAtFirstUnknown: true })
            if (args._unknown) {
                if (args.command && args.command[0] !== '-') {
                    const f = o[args.command]
                    if (f) {
                        const cmd = this._subCommands.get(args.command)
                        return cmd.parse(???)
                    }
                    else if (o['#!'])
                        o['#!'](args._unknown, args)
                    else {
                        console.error(`Unknown sub-command: ${args.command}`)
                        process.exit(1)
                    }
                } else {
                    console.error(`Unknown option: ${args._unknown[0]}`)
                    console.exit(1)
                }
            }
            if (args._help) {
                ...
            }
            return args
        } catch (e) {
            console.error(e.message)
            process.exit(1)
        }
    }

    usageString() {
        return commandLineUsage(this._usage)
    }
}

module.exports = { Command, }