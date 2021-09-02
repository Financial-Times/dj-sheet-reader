const { md, markdown, mdi, markdownInline } = require('../markdown')

test('md returns empty string when no args', () => {
	expect(md()).toStrictEqual('')
})

test('md returns empty string when value is null', () => {
	expect(md(null)).toStrictEqual('')
})

test('mdi returns empty string when no args', () => {
	expect(mdi()).toStrictEqual('')
})

test('mdi returns empty string when value is null', () => {
	expect(mdi(null)).toStrictEqual('')
})

test('md is alias for markdown', () => {
	expect(md).toStrictEqual(markdown)
})

test('mdi is alias for markdown', () => {
	expect(mdi).toStrictEqual(markdownInline)
})
