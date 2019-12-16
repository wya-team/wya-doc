
const stripByTag = (content, tag) => {
	const reg = new RegExp(`<(${tag})[\\s\\S]*>([\\s\\S]*)<\\/\\1>`);
	const result = content.match(reg);
	if (!result) return '';
	const insideContent = result[2];
	return result && insideContent ? insideContent.trim() : '';
};

exports.stripScript = content => stripByTag(content, 'script');

exports.stripStyle = content => stripByTag(content, 'style');


exports.stripTemplate = content => {
	content = content.trim();
	if (!content) return content;
	content = content.replace(/<(script|style)[\s\S]*<\/\1>/g, '').trim();
		
	if (content) {
		content = content.replace(/(^<template>)|(<\/template>$)/g, '').trim();
	}
	return content;
};
