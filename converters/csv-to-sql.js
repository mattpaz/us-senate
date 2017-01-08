var fs = require('fs');
var data = require('../data/senate.json');
var values = require('object.values');

if (!Object.values) {
  values.shim();
}

fs.truncate('data/senate.sql', 0, function() {

  fs.appendFile('data/senate.sql', 'TRUNCATE TABLE `senate`;\n');

  for (var i = 0; i < data.length; i++) {
    var query = 'INSERT INTO `senate` (`' + Object.keys(data[i]).join('`, `') + '`) VALUES ("' + Object.values(data[i]).join('", "') + '");\n';
    fs.appendFile('data/senate.sql', query.replace(/""/g, 'null'));
  }
});