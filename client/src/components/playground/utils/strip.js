
const stripByTag = (content, tag) => {
	const reg = new RegExp(`<(${tag})[\\s]*>([\\s\\S]*)<\\/\\1>`);
	const result = content.match(reg);
	if (!result) return '';
	const insideContent = result[2];
	return result && insideContent ? insideContent.trim() : '';
};

export const stripTemplate = content => stripByTag(content, 'template');

export const stripStyle = content => stripByTag(content, 'style');


export const stripScript = content => {
	content = content.trim();
	if (!content) return content;
	content = content.replace(/<(template|style)[\s\S]*<\/\1>/g, '').trim();

	return content
		? content.replace(/(^<script>)|(<\/script>$)/g, '').trim()
		: content;
};
