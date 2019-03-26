const cmd = new Command('new')
cmd
    .usage({
        header: 'Synopsis',
        content: `\
  $ astro new hello-world
  $ astro new --lib mech\
`,
    })
    .option({
        name: 'name',
        defaultOption: true,
    })
    .option({
        name: 'bin',
        type: Boolean,
        group: 'kind',
    })
    .option({
        name: 'lib',
        type: Boolean,
        group: 'kind',
    })
    .option({
        name: 'other',
        group: 'kind',
    })
    .onParse(args => {
        if (args.help || !args.name)
          this.printUsage()
        
    })

module.exports = cmd