const markdownIt = require('markdown-it')({
	linkify: true,
	typographer: true,
	breaks: true
}).use(require('markdown-it-anchor'));

function markdown(val) {
	return markdownIt.render((val || '')).trim();
}

function markdownInline(val) {
	return markdownIt.renderInline((val || '')).trim();
}

module.exports = {
	markdown,
	markdownInline,
	md: markdown,
	mdi: this.markdownInline,	
};