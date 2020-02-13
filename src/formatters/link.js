const { array } = require('./array');

function link(cellContent) {
	cellContent = cellContent || '';
	var arr = array(cellContent), links = [];
	arr.forEach(function (n, i) {
		if (!n) {
			return;
		}
		var pair = n.split(/\ +(?:(?=(?:\.{0,2}\/)+[\w\?\#][\w\/]+)|(?=[a-z]+\:\/\/\w+)|(?=(?:\?|\#)[\w\/%\+]+))/),
			obj = {
				text: pair[0],
				href: pair.length > 1 ? pair[1] : (/^((?:\.{0,2}\/)+[\w\?\#][\w\/]+|[a-z]+\:\/\/\w+|(?:\?|\#)[\w\/%\+]+)/i.test(pair[0]) ? pair[0] : null)
			};

		links.push(obj);
	});
	return links;
}

module.exports = {
	link,
}