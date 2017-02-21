var fs = require('fs');
var obj = require('../us-senate/data/us-senate.json');
var js2xmlparser = require('js2xmlparser');

var xml = js2xmlparser.parse('us-senate', { 'councilor': obj });

fs.writeFile('us-senate/data/us-senate.xml', xml);