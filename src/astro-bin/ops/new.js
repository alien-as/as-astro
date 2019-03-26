const cmd = new Command('new')
    .usage({
        header: 'Synopsis',
        content: 'Ulala!',
    })
    .option({
        name: 'name',
        defaultOption: true,
    })

module.exports = cmd