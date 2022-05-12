module.exports = {
	parserOptions: {
		ecmaVersion: 2018,
		sourceType: 'module',
	},
	env: {
		node: true,
		jest: true,
		es6: true,
	},
	extends: [
		'plugin:jest/recommended',
		'plugin:jest-formatting/recommended',
		'plugin:prettier/recommended',
		'eslint:recommended',
		'prettier',
	],
	plugins: ['jest-formatting'],
}
