const {
	moduleName,
	percent,
} = require('./lib');

/**
 * chunkalyse: summarise stats
 * @param  {Array} data.chunks
 * @return {Array}
 */
module.exports = ({chunks}) => chunks
	.map(
		({names, size, modules}) => ({
			name: names.shift(),
			size,
			modules: modules.reduce(
				(accumulator, {name, size}) => Object.assign(
					accumulator,
					{[moduleName(name)]: (accumulator[moduleName(name)] || 0) + size}
				),
				{}
			),
		})
	)
	.reduce(
		(accumulator, entry) => accumulator.concat(
			Object.assign(
				entry,
				{
					modules: Object.entries(entry.modules).reduce(
						(accumulator, [name, size]) => Object.assign(
							accumulator,
							{
								[name]: {
									size,
									percent: percent(size, entry.size),
								},
							}
						),
						{}
					),
				}
			),
		),
		[]
	);
