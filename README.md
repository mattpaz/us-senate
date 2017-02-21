![Civil Services Logo](https://cdn.civil.services/common/github-logo.png "Civil Services Logo")

__Civil Services__ is a collection of tools that make it possible for citizens to be apart of what is happening in their Local, State & Federal Governments.


115th United States Senate
===

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](https://raw.githubusercontent.com/CivilServiceUSA/api/master/LICENSE)  [![GitHub contributors](https://img.shields.io/github/contributors/CivilServiceUSA/api.svg)](https://github.com/CivilServiceUSA/api/graphs/contributors)

![Screenshot](screenshot.jpg "Screenshot")

We have also built an interactive search tool that can show you some interesting demographic data on US Senators.

## [★ Search US Senators ⧁](https://civilserviceusa.github.io/us-senate/)


Data Source
---

Our team Manages the [115th Congress United States Senate Demographic Data](http://bit.ly/115th-congress-us-senate) on Google Sheets.  This document is Read Only for the general public.  If you would like to update this document, [Join our Slack Team](https://slack.civil.services/bkx7n2) to learn now.


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

* [CSV](us-senate/data/senate.csv)
* [JSON](us-senate/data/senate.json)
* [SQL](us-senate/data/senate.sql) & [SQL Table](us-senate/data/us-senate.table.sql) 
* [XML](us-senate/data/senate.xml)
* [YML](us-senate/data/senate.yml)


Data Set
---

The following information is available for each US Senator.

property          | type    | description
------------------|---------|------------
`state`           | string  | State City Council belongs to
`bioguide`        | string  | The alphanumeric ID for this legislator on http://bioguide.congress.gov ( http://bioguide.congress.gov/scripts/biodisplay.pl?index=C001075 )
`thomas`          | string  | The numeric ID for this legislator ( not really used anymore )
`govtrack`        | string  | The numeric ID for this legislator on GovTrack.us ( https://www.govtrack.us/congress/members/412630 )
`opensecrets`     | string  | The alphanumeric ID for this legislator on OpenSecrets.org ( https://www.opensecrets.org/politicians/summary.php?cid=N00030245 )
`votesmart`       | string  | The numeric ID for this legislator on VoteSmart.org ( http://votesmart.org/candidate/69494 )
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
`slug`            | string  | Name converted to Slug ( lower case & dashes only )
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


Developers
---

The main data file is `data/senate.json` and is the only one you need to make changes too.  Once changes are made
you can automatically gernate the CSV, SQL, XML & YML files automagically by running the following in a terminal window:

```bash
npm install
npm run convert
```