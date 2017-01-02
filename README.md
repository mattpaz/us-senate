![Civil Services Logo](https://raw.githubusercontent.com/CivilServiceUSA/api/master/docs/img/logo.png "Civil Services Logo")

__Civil Services__ is a collection of tools that make it possible for citizens to be apart of what is happening in their Local, State & Federal Governments.


115th United States Senate
===

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://raw.githubusercontent.com/CivilServiceUSA/api/master/LICENSE)  [![GitHub contributors](https://img.shields.io/github/contributors/CivilServiceUSA/api.svg)](https://github.com/CivilServiceUSA/api/graphs/contributors)

### [View Senators](https://civilserviceusa.github.io/us-senate/)

Senator Headshots
---

Civil Services created high-resolution photos for each US Senator and made them available in the following sizes:

* 1024 x 1024 pixels
* 512 x 512 pixels
* 256 x 256 pixels
* 128 x 128 pixels
* 64 x 64 pixels

You can either copy the `headshots` folder into your project, or we also offer a CDN.

If you are using the image `headshots/512x512/bernard-sanders.jpg` the CDN for that file would be `https://cdn.civil.services/senate/headshots/512x512/bernard-sanders.jpg`

Senator Data
---

This project offers data for the 115th United States Senate in the following formats:

* [CSV](data/senate.csv)
* [GeoJSON](data/senate.geojson)
* [JSON](data/senate.json)
* [SQL](data/senate.sql)
* [XLSX](data/senate.xlsx)
* [XML](data/senate.xml)
* [YML](data/senate.yml)

Data Set
---

The following information is available for each US Senator.

property          | type    | description
------------------|---------|------------
`state`           | string  | State City Council belongs to
`congress_id`     | string  | Unique Congress ID from Congress.gov
`party`           | enum    | Party of City Council Representative `['democrat','republican','independent']`
`status`          | enum    | Status of Senator `['active','inactive']`
`majority_leader` | boolean | Senator is Majority Leader of Party
`majority_whip`   | boolean | Senator is Majority Whip of Party
`minority_leader` | boolean | Senator is Minority Leader of Party
`minority_whip`   | boolean | Senator is Minority Whip of Party
`class`           | enum    | Senate to be divided into three classes for purposes of elections `['I','II','III']`
`gender`          | enum    | Gender of Senator `['female','male']`
`ethnicity`       | enum    | Ethnicity of Senator `['african-american','asian-american','hispanic-american','white']`
`name`            | string  | Name of City Council Representative
`date_of_birth`   | date    | Senator's Date of Birth
`entered_office`  | date    | Date Senator First Entered Office
`term_end`        | date    | Date Senator's Tern Ends
`latitude`        | float   | GPS Latitude of Office
`longitude`       | float   | GPS Longitude of Office
`address`         | string  | Mailing Address
`website`         | string  | Senator's Website
`phone`           | string  | Phone Number
`twitter_url`     | string  | Twitter URL
`facebook_url`    | string  | Facebook URL
`photo_url`       | string  | Photo URL
`biography`       | string  | Senator's Biography from Congress.gov
