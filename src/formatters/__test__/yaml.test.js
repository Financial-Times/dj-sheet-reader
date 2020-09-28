const { yaml, yml } = require('../yaml');

test('yml is alias for yaml', () => {
	expect(yml).toStrictEqual(yaml);
});
