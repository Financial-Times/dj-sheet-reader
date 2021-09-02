module.exports = {
	printWidth: 120,
	singleQuote: true,
	bracketSpacing: true,
	useTabs: true,
	tabWidth: 2,
	trailingComma: 'all',
	arrowParens: 'always',
	semi: false,
	overrides: [
		{
			// npm uses 2 spaces rather than tabs, so maintain that rule when
			// the file has any manual edit
			files: ['**/package.json'],
			options: {
				useTabs: false,
				tabWidth: 2,
			},
		},
	],
}
