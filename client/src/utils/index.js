export const genRoutes = (data) => {
	return data.map(it => {
		const { components, ...rest } = it;
		it = { ...rest };
		if (components) {
			it.components = {};
			Object.keys(components).forEach(component => {
				console.log(components[component], component);

				it.components[component] = () => import(components[component]);
			});
		}
		// console.log(it);
		return it;
	});
};