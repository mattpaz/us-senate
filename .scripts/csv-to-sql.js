var fs = require('fs');
var data = require('../us-senate/data/us-senate.json');
var values = require('object.values');

if (!Object.values) {
  values.shim();
}

fs.truncate('us-senate/data/us-senate.sql', 0, function() {
  for (var i = 0; i < data.length; i++) {
    var query = 'INSERT INTO `us-senate` (`' + Object.keys(data[i]).join('`, `') + '`) VALUES ("' + Object.values(data[i]).join('", "') + '");\n';
    fs.appendFile('us-senate/data/us-senate.sql', query.replace(/""/g, 'null'), function (){});
  }
});
