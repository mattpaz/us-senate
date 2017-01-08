var fs = require('fs');
var obj = require('../data/senate.json');
var js2xmlparser = require('js2xmlparser');

var xml = js2xmlparser.parse('senate', { 'senator': obj });

fs.writeFile('data/senate.xml', xml);