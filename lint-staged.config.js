module.exports = {
	'*': ['prettier --write --ignore-unknown'],
	'**/*.js': ['eslint --ext .js --fix'],
}
