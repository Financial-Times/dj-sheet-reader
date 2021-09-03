module.exports = {
	'**/*.json': ['prettier --write'],
	'**/*.js': ['prettier --write', 'eslint --ext .js --fix'],
}
