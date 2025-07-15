const parseHook = (oldParse, newParse) => {
	return (ctx, ...args) => {
		return newParse({
			...ctx,
			parsed: oldParse({ ...ctx, parsed: {} }, ...args),
		}, ...args)
	}
}

export {
	parseHook,
}
