const now = +(new Date());
let index = 0;

export const getUid = () => {
	return `wya-${now}-${++index}`;
};