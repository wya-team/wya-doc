import mdContainer from 'markdown-it-container';
import { PG_MARK } from './constants';

/**
 * 自定义container
 * 比如:::playground
 */
export default md => {
	const reg = new RegExp(`^${PG_MARK}\\s*(.*)$`);
	md.use(mdContainer, PG_MARK, {
		validate(params) {
			return params.trim().match(reg);
		}
	});
};
