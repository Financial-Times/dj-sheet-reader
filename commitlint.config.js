module.exports = {
	extends: ['@commitlint/config-conventional'],
	rules: {
		'body-max-line-length': [1, 'always', 300],
		'body-max-length': [1, 'always', 1000],
	},
}
