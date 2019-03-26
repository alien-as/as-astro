const cmd = new Command('new')
cmd
    .usage({
        header: 'Synopsis',
        content: 'Ulala!',
    })
    .option({
        name: 'name',
        defaultOption: true,
    })
    .onParse(args => {
        if (args.help)
          this.printUsage()
        
    })

module.exports = cmd