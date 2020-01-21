var fs = require('fs');
var path = require('path');

var date = new Date();
var year = date.getFullYear().toString();
var month = (date.getMonth() + 1).toString();
var day = date.getDate().toString();

if (month.length === 1) {
  month = '0' + month;
}

if (day.length === 1) {
  day = '0' + day;
}

var prefix = year + month + day;
var collection, data;
var seeder_file = path.join(__dirname, '../us-senate/data/' + prefix + '000000-senate-seeder.js');
var data_file = path.join(__dirname, '../us-senate/data/us-senate.json');

function createSeeder() {
  var seeder = "module.exports = {\n" +
  "  up: function (queryInterface) {\n" +
  "    return queryInterface.bulkInsert('senate', " +
  JSON.stringify(collection, null, 4) +
  ", {\n" +
  "      updateOnDuplicate: ['state_name', 'state_name_slug', 'state_code', 'state_code_slug', 'class', 'bioguide', 'thomas', 'opensecrets', 'votesmart', 'fec', 'maplight', 'wikidata', 'google_entity_id', 'title', 'party', 'name', 'name_slug', 'first_name', 'middle_name', 'last_name', 'name_suffix', 'goes_by', 'pronunciation', 'gender', 'ethnicity', 'religion', 'openly_lgbtq', 'date_of_birth', 'entered_office', 'term_end', 'biography', 'phone', 'fax', 'latitude', 'longitude', 'address_complete', 'address_number', 'address_prefix', 'address_street', 'address_sec_unit_type', 'address_sec_unit_num', 'address_city', 'address_state', 'address_zipcode', 'address_type', 'website', 'contact_page', 'facebook_url', 'twitter_handle', 'twitter_url', 'photo_url', 'shape', 'modified_date']\n" +
  "    }).catch(function (err) {\n" +
  "      if (err && err.errors) {\n" +
  "        for (var i = 0; i < err.errors.length; i++) {\n" +
  "          console.error('× SEED ERROR', err.errors[ i ].type, err.errors[ i ].message, err.errors[ i ].path, err.errors[ i ].value);\n" +
  "        }\n" +
  "      } else if (err && err.message) {\n" +
  "        console.error('× SEED ERROR', err.message);\n" +
  "      }\n" +
  "    });\n" +
  "  },\n" +
  "    down: function (queryInterface) {\n" +
  "    return queryInterface.bulkDelete('senate', null, {});\n" +
  "  }" +
  "};\n";

  seeder = seeder.replace(/"queryInterface/g, 'queryInterface');
  seeder = seeder.replace(/}'\)"/g, '}\')');
  seeder = seeder.replace(/"new Date\(\)"/g, 'new Date()');
  seeder = seeder.replace(/"([a-z_]+)":/g, '$1:');
  seeder = seeder.replace(/\\"type\\":/g, '"type":');
  seeder = seeder.replace(/\\"MultiPolygon\\"/g, '"MultiPolygon"');
  seeder = seeder.replace(/\\"Polygon\\"/g, '"Polygon"');
  seeder = seeder.replace(/\\"coordinates\\":/g, '"coordinates":');

  fs.writeFile(seeder_file, seeder, function (){});
}

if (!fs.existsSync(data_file)) {
  console.error('× Missing JSON Data: ' + data_file.replace(path.join(__dirname, '../'), './'));
} else {

  collection = [];
  data = JSON.parse(fs.readFileSync(data_file, 'utf8'));

  for (var i = 0; i < data.length; i++) {

    var geojsonFile = 'us-senate/geojson/' + data[i].state_code_slug + '.geojson';
    var geojson = fs.readFileSync(path.join(__dirname, '../' + geojsonFile), 'utf8');

    data[i].shape = 'queryInterface.sequelize.fn(\'ST_GeomFromGeoJSON\', \'' + geojson + '\')';
    data[i].created_date = 'new Date()';
    data[i].modified_date = 'new Date()';
    collection.push(data[i]);
  }

  createSeeder();

  console.log('\n☆ Seeder Creation Completed ' + '\n');
}
