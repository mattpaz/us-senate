var lazyInterval;
var LazyLoad = (function() {
  "use strict";
  var fn, api;

  fn = {

    _lazyLoadImages: function() {

      var allLazyLoadElements = document.querySelectorAll(".lazy-load");

      for(var i=0; i < allLazyLoadElements.length; i++ ) {

        var eachLazyLoadElement = allLazyLoadElements[i];

        var checkIfImageAlreadyLoaded = (eachLazyLoadElement.getAttribute('data-bgsrc') || eachLazyLoadElement.getAttribute('data-src')) ? true : false;

        var hiddenInview = eachLazyLoadElement.classList.contains('hidden-inview') || false;

        if (checkIfImageAlreadyLoaded && fn._isElementVisible(eachLazyLoadElement, hiddenInview)) {
          fn._loadImage(eachLazyLoadElement, function (element) {
            element.classList.add('animated');
            element.classList.add('fadeIn');
            element.classList.remove('lazy-load');

            element.removeAttribute("data-src");
            element.removeAttribute("data-bgsrc");
          });
        }
      }
    },

    _isElementVisible: function(element, hiddenInview) {
      var rectValues = element.getBoundingClientRect(),
        viewportWidth = window.innerWidth || document.documentElement.clientWidth,
        viewportHeight = window.innerHeight || document.documentElement.clientHeight,
        detectCorner = function(x, y) {
          return document.elementFromPoint(x, y)
        };


      if (element.style.display === 'none' || rectValues.right < 0 || rectValues.bottom < 0 || rectValues.left > viewportWidth || rectValues.top > viewportHeight){
        return false;
      }


      if(!hiddenInview && element.style.display === '' && rectValues.left >= 0 && rectValues.top >= 0 && rectValues.right <= viewportWidth && rectValues.bottom <= viewportHeight){
        return true;
      }

      return (
        element.style.display === '' && (
          element.contains(detectCorner(rectValues.left, rectValues.top)) ||
          element.contains(detectCorner(rectValues.right, rectValues.top)) ||
          element.contains(detectCorner(rectValues.right, rectValues.bottom)) ||
          element.contains(detectCorner(rectValues.left, rectValues.bottom)
          )
        )
      );
    },

    _loadImage: function(element, callback) {
      var isBackgroundImage = element.getAttribute('data-bgsrc') ? true : false,
        tempImg = new Image(),
        src = isBackgroundImage ? element.getAttribute('data-bgsrc') : element.getAttribute('data-src');

      tempImg.onload = function() {
        if(isBackgroundImage){
          element.style.backgroundImage =  "url("+ src + ")";
        }else{
          element.src = src;
        }

        callback ? callback(element) : null;
      };
      tempImg.onerror = function() {
        if(isBackgroundImage){
          element.style.backgroundImage =  src;
        }else{
          element.src = src;
        }

        callback ? callback(element) : null;
      };
      tempImg.src = src;
    }
  };

  api = {
    lazyLoadImages: function() {
      return fn._lazyLoadImages.apply(this, arguments);
    },
    isElementVisible: function() {
      return fn._isElementVisible.apply(this, arguments);
    }
  };

  return api;
})();

/**
 *
 * @param src
 * @param onLoad
 */
function loadScript(src, onLoad) {
  var script_tag = document.createElement('script');
  script_tag.setAttribute('type', 'text/javascript');
  script_tag.setAttribute('src', src);

  if (script_tag.readyState) {
    script_tag.onreadystatechange = function () {
      if (this.readyState == 'complete' || this.readyState == 'loaded') {
        onLoad();
      }
    };
  } else {
    script_tag.onload = onLoad;
  }

  // append loaded script to head
  (document.getElementsByTagName('head')[0] || document.documentElement).appendChild(script_tag);
}

/**
 *
 */
function scrolltoTop() {
  $('.senators').animate({ scrollTop: 0 });
}

/**
 *
 * @param str
 * @returns {*}
 */
function toTitleCase(str) {
  if (!str || typeof str === 'boolean') {
    return '';
  }

  str = str.toString();

  return str.replace(/_/g, ' ').replace(/-/g, ' ').replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

/**
 * Update URL so people can share links to their searches
 */
function buildPopState() {
  var url = '';
  var titles = [];
  var parties = [];
  var genders = [];
  var ethnicities = [];
  var religions = [];
  var lgbtq = [];
  var search = $('#search').val();

  $('.filter-title input:checked').each(function() { titles.push($(this).val()) });
  $('.filter-party input:checked').each(function() { parties.push($(this).val()) });
  $('.filter-gender input:checked').each(function() { genders.push($(this).val()) });
  $('.filter-ethnicity input:checked').each(function() { ethnicities.push($(this).val()) });
  $('.filter-religion input:checked').each(function() { religions.push($(this).val()) });
  $('.filter-lgbtq input:checked').each(function() { lgbtq.push($(this).val()) });

  if (titles.length > 0 || parties.length > 0 || genders.length > 0 || ethnicities.length > 0 || religions.length > 0 || lgbtq.length > 0 || search.length > 0) {
    url = '?filtered=true';
  }

  if (titles.length > 0) {
    url += '&title=' + titles.join(',');
  }

  if (parties.length > 0) {
    url += '&party=' + parties.join(',');
  }

  if (genders.length > 0) {
    url += '&gender=' + genders.join(',');
  }

  if (ethnicities.length > 0) {
    url += '&ethnicity=' + ethnicities.join(',');
  }

  if (religions.length > 0) {
    url += '&religion=' + religions.join(',');
  }

  if (lgbtq.length > 0) {
    url += '&lgbtq=' + lgbtq.join(',');
  }

  if (search.length > 0) {
    url += '&search=' + search;
  }

  if (url !== '') {
    history.pushState(null, null, url);
  } else {
    history.pushState(null, null, '?filtered=false');
  }
}

/**
 * Initialize
 */
function init() {
  $.getJSON('us-senate/data/us-senate.json', function( data ) {

    $.each( data, function( key, val ) {
      if (!val.vacant) {
        var website = (val.website) ? '<a href="' + val.website + '" target="_blank" title="Visit ' + val.name + '\'s Website" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"><i class="fa fa-external-link-square"></i></a>' : '';
        var contact_page = (val.contact_page) ? '<a href="' + val.contact_page + '" target="_blank" title="Contact ' + val.name + '" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"><i class="fa fa-envelope"></i></a>' : '';

        var twitter = (val.twitter_url) ? '<a href="' + val.twitter_url + '" target="_blank" title="Visit ' + val.name + '\'s Twitter Profile" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"><i class="fa fa-twitter"></i></a>' : '';
        var facebook = (val.facebook_url) ? '<a href="' + val.facebook_url + '" target="_blank" title="Visit ' + val.name + '\'s Facebook Profile" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"><i class="fa fa-facebook"></i></a>' : '';
        var email = (val.email) ? '<a href="mailto:' + val.email + '" title="Email ' + val.name + '" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"><i class="fa fa-envelope"></i></a>' : '';
        var phone = (val.phone) ? '<a href="tel:' + val.phone + '" title="Call ' + val.name + '" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"><i class="fa fa-phone"></i></a>' : '';
        var address = (val.address_complete) ? '<a href="https://maps.google.com?q=' + val.address_complete.replace(/,/g, '').replace(/ /g, '+') + '" title="View ' + val.name + '\'s Office on a Map" target="_blank" class="mdl-button mdl-button--colored mdl-js-button mdl-js-ripple-effect"><i class="fa fa-map-marker"></i></a>' : '';

        var district = (val.district) ? '   District: ' + toTitleCase(val.district) : '';
        var at_large = (val.at_large) ? '   At-large' + toTitleCase(val.at_large) : '&nbsp;';

        var html = '<div class="senator mdl-card mdl-shadow--2dp card-square fade-in c' + key + '" onclick="void(0)" data-name="' + val.name + '" data-party="' + val.party + '" data-gender="' + val.gender + '" data-lgbtq="' + val.openly_lgbtq + '" data-ethnicity="' + val.ethnicity + '" data-title="' + val.title + '" data-religion="' + val.religion + '" data-state-name="' + val.state_name + '">' +
          '<div class="mdl-card__title mdl-card--expand lazy-load" data-bgsrc="us-senate/images/headshots/512x512/' + val.name_slug + '.jpg">' +
          '   <h2 class="mdl-card__title-text">' + val.name + '</h2>' +
          '   <h2 class="overlay"></h2>' +
          '</div>' +
          '<div class="mdl-card__supporting-text">' +
          '<strong>' + toTitleCase(val.title) + '</strong> - ' + toTitleCase(val.party) + '<br/>' +
          '<strong>' + val.state_name + '</strong> ' + district + at_large +
          '</div>' +
          '<div class="mdl-card__actions mdl-card--border">' +
          '   ' + website + contact_page + twitter + facebook + email + phone + address +
          '</div>' +
          '</div>';

        var jsonld = {
          "@context": "http://schema.org",
          "@type": "Person",
          "address": {
            "@type": "PostalAddress"
          },
          "url": "http://www.janedoe.com",
          "sameAs": []
        };

        if (val.email) {
          jsonld.email = 'mailto:' + val.email;
        }

        if (val.phone) {
          jsonld.telephone = val.phone;
        }

        if (val.twitter_url) {
          jsonld.sameAs.push(val.twitter_url);
        }

        if (val.facebook_url) {
          jsonld.sameAs.push(val.facebook_url);
        }

        jsonld.image = val.photo_url;
        jsonld.jobTitle = toTitleCase(val.title) + ' of House of Representatives';
        jsonld.name = val.name;
        jsonld.url = val.website;

        jsonld.address.addressLocality = val.address_city;
        jsonld.address.addressRegion = val.address_state;
        jsonld.address.postalCode = val.address_zipcode;
        jsonld.address.streetAddress = val.address_number + ' ' + val.address_prefix + ' ' + val.address_street + ', ' + val.address_sec_unit_type + ' ' + val.address_sec_unit_num;

        var jsonld_script = '<scr' + 'ipt type="application/ld+json">' + JSON.stringify(jsonld) + '</scr' + 'ipt>';

        $(html).appendTo('.senators .wrapper');
        $(jsonld_script).appendTo('head');
      }
    });

    $('input[type="checkbox"]').change(updateRepresentatives);

    setTimeout(LazyLoad.lazyLoadImages, 250)

    $('#scroll-wrapper').scroll(function () {
      clearTimeout(lazyInterval);
      lazyInterval = setTimeout(LazyLoad.lazyLoadImages, 250);
    });

    var QueryString = function () {
      var query_string = {};
      var query = window.location.search.substring(1);
      var vars = query.split("&");
      for (var i=0;i<vars.length;i++) {
        var pair = vars[i].split("=");
        if (typeof query_string[pair[0]] === "undefined") {
          query_string[pair[0]] = decodeURIComponent(pair[1]);
        } else if (typeof query_string[pair[0]] === "string") {
          var arr = [ query_string[pair[0]],decodeURIComponent(pair[1]) ];
          query_string[pair[0]] = arr;
        } else {
          query_string[pair[0]].push(decodeURIComponent(pair[1]));
        }
      }
      return query_string;
    }();

    if (QueryString && QueryString.search) {
      $('#search').val(QueryString.search);
    }

    loadScript('https://storage.googleapis.com/code.getmdl.io/1.0.2/material.min.js', function() {
      if ('classList' in document.createElement('div') && 'querySelector' in document && 'addEventListener' in window && Array.prototype.forEach) {
        document.documentElement.classList.add('mdl-js');
        componentHandler.upgradeAllRegistered();
      } else {
        componentHandler.upgradeElement = componentHandler.register = function() {};
      }

      if (QueryString && QueryString.title) {
        var filterTitles = QueryString.title.split(',');
        for (var i = 0; i < filterTitles.length; i++) {
          $('div.filter-title input[value="' + filterTitles[i] + '"]').trigger('click');
        }
      }

      if (QueryString && QueryString.party) {
        var filterParties = QueryString.party.split(',');
        for (var i = 0; i < filterParties.length; i++) {
          $('div.filter-party input[value="' + filterParties[i] + '"]').trigger('click');
        }
      }

      if (QueryString && QueryString.gender) {
        var filterGenders = QueryString.gender.split(',');
        for (var i = 0; i < filterGenders.length; i++) {
          $('div.filter-gender input[value="' + filterGenders[i] + '"]').trigger('click');
        }
      }

      if (QueryString && QueryString.ethnicity) {
        var filterEthnicities = QueryString.ethnicity.split(',');
        for (var i = 0; i < filterEthnicities.length; i++) {
          $('div.filter-ethnicity input[value="' + filterEthnicities[i] + '"]').trigger('click');
        }
      }

      if (QueryString && QueryString.religion) {
        var filterReligions = QueryString.religion.split(',');
        for (var i = 0; i < filterReligions.length; i++) {
          $('div.filter-religion input[value="' + filterReligions[i] + '"]').trigger('click');
        }
      }

      if (QueryString && QueryString.lgbtq) {
        var filterLgbtq = QueryString.lgbtq.split(',');
        for (var i = 0; i < filterLgbtq.length; i++) {
          $('div.filter-lgbtq input[value="' + filterLgbtq[i] + '"]').trigger('click');
        }
      }

      if (QueryString.search) {
        doSearch();
      } else {
        updateRepresentatives();
      }
    });
  });
}

loadScript('https://code.jquery.com/jquery-2.2.4.min.js', init);

function isCommandPressed(event) {
  return event.metaKey && ! event.ctrlKey;
}

function openSearch() {
  updateRepresentatives();
  $('.modal').show();
  $('section').addClass('searching');
  setTimeout(function(){
    $('#search').focus();
  }, 250);
  clearInterval(lazyInterval);
}

function closeSearch() {
  $('.modal').fadeOut();
  scrolltoTop();
  $('section').removeClass('searching');
  buildPopState();
}

function doSearch(){
  var search = $('#search').val();
  if (search && search !== '') {
    $('.senator').hide();
    $('.senator[data-name*="' + search + '" i]').show();
    $('.senator[data-state-name*="' + search + '" i]').show();
    $('.senator[data-party*="' + search + '" i]').show();
  } else {
    $('.senator').show();
  }

  var count = $('.senator:visible').length;
  var total = $('.senator').length;
  var percent = Math.round((count / total) * 100);

  $('#search-total').text(count);

  if (count > 0 && total > 0 && count !== total) {
    $('#search-total').show();
  } else {
    $('#search-total').hide();
  }

  $('span.count').text(count);
  $('span.total').text(total);
  $('span.percent').text(percent + '%');

  $('.senators').addClass('enabled');
  $('#loading').fadeOut();

  clearTimeout(lazyInterval);
  lazyInterval = setTimeout(LazyLoad.lazyLoadImages, 250);
}

function updateRepresentatives () {
  // Handle Title
  var $senator = $('.senator[data-title="senator"]');
  var $senate_majority_leader = $('.senator[data-title="senate_majority_leader"]');
  var $senate_majority_whip = $('.senator[data-title="senate_majority_whip"]');
  var $senate_minority_leader = $('.senator[data-title="senate_minority_leader"]');
  var $senate_minority_whip = $('.senator[data-title="senate_minority_whip"]');

  var senator = $('#title-senator').is(':checked');
  var senate_majority_leader = $('#title-senate-majority-leader').is(':checked');
  var senate_majority_whip = $('#title-senate-majority-whip').is(':checked');
  var senate_minority_leader = $('#title-senate-minority-leader').is(':checked');
  var senate_minority_whip = $('#title-senate-minority-whip').is(':checked');

  $senator.show();
  $senate_majority_leader.show();
  $senate_majority_whip.show();
  $senate_minority_leader.show();
  $senate_minority_whip.show();

  // Hide Checkboxes for Options we don't need
  if($senator.length === 0) {
    $('#title-senator').closest('label').hide();
  }

  if($senate_majority_leader.length === 0) {
    $('#title-senate-majority-leader').closest('label').hide();
  }

  if($senate_majority_whip.length === 0) {
    $('#title-senate-majority-whip').closest('label').hide();
  }

  if($senate_minority_leader.length === 0) {
    $('#title-senate-minority-leader').closest('label').hide();
  }

  if($senate_minority_whip.length === 0) {
    $('#title-senate-minority-whip').closest('label').hide();
  }

  // Handle Party
  var $constitution = $('.senator[data-party="constitution"]');
  var $democrat = $('.senator[data-party="democrat"]');
  var $green = $('.senator[data-party="green"]');
  var $independent = $('.senator[data-party="independent"]');
  var $libertarian = $('.senator[data-party="libertarian"]');
  var $nonpartisan = $('.senator[data-party="nonpartisan"]');
  var $republican = $('.senator[data-party="republican"]');

  var constitution = $('#party-constitution').is(':checked');
  var democrat = $('#party-democrat').is(':checked');
  var green = $('#party-green').is(':checked');
  var independent = $('#party-independent').is(':checked');
  var libertarian = $('#party-libertarian').is(':checked');
  var nonpartisan = $('#party-nonpartisan').is(':checked');
  var republican = $('#party-republican').is(':checked');

  $constitution.show();
  $democrat.show();
  $green.show();
  $independent.show();
  $libertarian.show();
  $nonpartisan.show();
  $republican.show();

  // Hide Checkboxes for Options we don't need
  if($constitution.length === 0) {
    $('#party-constitution').closest('label').hide();
  }

  if($democrat.length === 0) {
    $('#party-democrat').closest('label').hide();
  }

  if($green.length === 0) {
    $('#party-green').closest('label').hide();
  }

  if($independent.length === 0) {
    $('#party-independent').closest('label').hide();
  }

  if($libertarian.length === 0) {
    $('#party-libertarian').closest('label').hide();
  }

  if($nonpartisan.length === 0) {
    $('#party-nonpartisan').closest('label').hide();
  }

  if($republican.length === 0) {
    $('#party-republican').closest('label').hide();
  }

  // Handle Gender
  var $female = $('.senator[data-gender="female"]');
  var $male = $('.senator[data-gender="male"]');
  var $unspecified_gender = $('.senator[data-gender="unspecified"]');

  var female = $('#gender-female').is(':checked');
  var male = $('#gender-male').is(':checked');
  var unspecified_gender = $('#gender-unspecified').is(':checked');

  $female.show();
  $male.show();
  $unspecified_gender.show();

  // Hide Checkboxes for Options we don't need
  if($female.length === 0) {
    $('#gender-female').closest('label').hide();
  }

  if($male.length === 0) {
    $('#gender-male').closest('label').hide();
  }

  if($unspecified_gender.length === 0) {
    $('#gender-unspecified').closest('label').hide();
  }

  // Handle Ethnicity
  var $african_american = $('.senator[data-ethnicity="african-american"]');
  var $asian_american = $('.senator[data-ethnicity="asian-american"]');
  var $hispanic_american = $('.senator[data-ethnicity="hispanic-american"]');
  var $middle_eastern_american = $('.senator[data-ethnicity="middle-eastern-american"]');
  var $multi_racial_american = $('.senator[data-ethnicity="multi-racial-american"]');
  var $native_american = $('.senator[data-ethnicity="native-american"]');
  var $pacific_islander = $('.senator[data-ethnicity="pacific-islander"]');
  var $white_american = $('.senator[data-ethnicity="white-american"]');
  var $unspecified = $('.senator[data-ethnicity="unspecified"]');

  var african_american = $('#ethnicity-african-american').is(':checked');
  var asian_american = $('#ethnicity-asian-american').is(':checked');
  var hispanic_american = $('#ethnicity-hispanic-american').is(':checked');
  var middle_eastern_american = $('#ethnicity-middle-eastern-american').is(':checked');
  var multi_racial_american = $('#ethnicity-multi-racial-american').is(':checked');
  var native_american = $('#ethnicity-native-american').is(':checked');
  var pacific_islander = $('#ethnicity-pacific-islander').is(':checked');
  var white_american = $('#ethnicity-white-american').is(':checked');
  var unspecified = $('#ethnicity-unspecified').is(':checked');

  $african_american.show();
  $asian_american.show();
  $hispanic_american.show();
  $middle_eastern_american.show();
  $multi_racial_american.show();
  $native_american.show();
  $pacific_islander.show();
  $white_american.show();
  $unspecified.show();

  // Hide Checkboxes for Options we don't need
  if($african_american.length === 0) {
    $('#ethnicity-african-american').closest('label').hide();
  }

  if($asian_american.length === 0) {
    $('#ethnicity-asian-american').closest('label').hide();
  }

  if($hispanic_american.length === 0) {
    $('#ethnicity-hispanic-american').closest('label').hide();
  }

  if($middle_eastern_american.length === 0) {
    $('#ethnicity-middle-eastern-american').closest('label').hide();
  }

  if($multi_racial_american.length === 0) {
    $('#ethnicity-multi-racial-american').closest('label').hide();
  }

  if($native_american.length === 0) {
    $('#ethnicity-native-american').closest('label').hide();
  }

  if($pacific_islander.length === 0) {
    $('#ethnicity-pacific-islander').closest('label').hide();
  }

  if($white_american.length === 0) {
    $('#ethnicity-white-american').closest('label').hide();
  }

  if($unspecified.length === 0) {
    $('#ethnicity-unspecified').closest('label').hide();
  }

  // Handle Religion
  var $african_methodist = $('.senator[data-religion="african-methodist"]');
  var $anglican = $('.senator[data-religion="anglican"]');
  var $baptist = $('.senator[data-religion="baptist"]');
  var $buddhism = $('.senator[data-religion="buddhism"]');
  var $christian = $('.senator[data-religion="christian"]');
  var $christian_reformed = $('.senator[data-religion="christian-reformed"]');
  var $christian_scientist = $('.senator[data-religion="christian-scientist"]');
  var $church_of_christ = $('.senator[data-religion="church-of-christ"]');
  var $church_of_god = $('.senator[data-religion="church-of-god"]');
  var $congregationalist = $('.senator[data-religion="congregationalist"]');
  var $deist = $('.senator[data-religion="deist"]');
  var $eastern_orthodox = $('.senator[data-religion="eastern-orthodox"]');
  var $episcopalian = $('.senator[data-religion="episcopalian"]');
  var $evangelical = $('.senator[data-religion="evangelical"]');
  var $evangelical_lutheran = $('.senator[data-religion="evangelical-lutheran"]');
  var $hindu = $('.senator[data-religion="hindu"]');
  var $jewish = $('.senator[data-religion="jewish"]');
  var $jodo_shinshu_buddhist = $('.senator[data-religion="jodo-shinshu-buddhist"]');
  var $lutheran = $('.senator[data-religion="lutheran"]');
  var $methodist = $('.senator[data-religion="methodist"]');
  var $mormon = $('.senator[data-religion="mormon"]');
  var $muslim = $('.senator[data-religion="muslim"]');
  var $nazarene_christian = $('.senator[data-religion="nazarene-christian"]');
  var $pentecostal = $('.senator[data-religion="pentecostal"]');
  var $presbyterian = $('.senator[data-religion="presbyterian"]');
  var $protestant = $('.senator[data-religion="protestant"]');
  var $roman_catholic = $('.senator[data-religion="roman-catholic"]');
  var $seventh_day_adventist_church = $('.senator[data-religion="seventh-day-adventist-church"]');
  var $soka_gakkai_buddhist = $('.senator[data-religion="soka-gakkai-buddhist"]');
  var $southern_baptist = $('.senator[data-religion="southern-baptist"]');
  var $united_church_of_christ = $('.senator[data-religion="united-church-of-christ"]');
  var $united_methodist = $('.senator[data-religion="united-methodist"]');
  var $unitarian_universalist = $('.senator[data-religion="unitarian-universalist"]');
  var $unspecified_religion = $('.senator[data-religion="unspecified"]');

  var african_methodist = $('#religion-african-methodist').is(':checked');
  var anglican = $('#religion-anglican').is(':checked');
  var baptist = $('#religion-baptist').is(':checked');
  var buddhism = $('#religion-buddhism').is(':checked');
  var christian = $('#religion-christian').is(':checked');
  var christian_reformed = $('#religion-christian-reformed').is(':checked');
  var christian_scientist = $('#religion-christian-scientist').is(':checked');
  var church_of_christ = $('#religion-church-of-christ').is(':checked');
  var church_of_god = $('#religion-church-of-god').is(':checked');
  var congregationalist = $('#religion-congregationalist').is(':checked');
  var deist = $('#religion-deist').is(':checked');
  var eastern_orthodox = $('#religion-eastern-orthodox').is(':checked');
  var episcopalian = $('#religion-episcopalian').is(':checked');
  var evangelical = $('#religion-evangelical').is(':checked');
  var evangelical_lutheran = $('#religion-evangelical-lutheran').is(':checked');
  var hindu = $('#religion-hindu').is(':checked');
  var jewish = $('#religion-jewish').is(':checked');
  var jodo_shinshu_buddhist = $('#religion-jodo-shinshu-buddhist').is(':checked');
  var lutheran = $('#religion-lutheran').is(':checked');
  var methodist = $('#religion-methodist').is(':checked');
  var mormon = $('#religion-mormon').is(':checked');
  var muslim = $('#religion-muslim').is(':checked');
  var nazarene_christian = $('#religion-nazarene-christian').is(':checked');
  var pentecostal = $('#religion-pentecostal').is(':checked');
  var presbyterian = $('#religion-presbyterian').is(':checked');
  var protestant = $('#religion-protestant').is(':checked');
  var roman_catholic = $('#religion-roman-catholic').is(':checked');
  var seventh_day_adventist_church = $('#religion-seventh-day-adventist-church').is(':checked');
  var soka_gakkai_buddhist = $('#religion-soka-gakkai-buddhist').is(':checked');
  var southern_baptist = $('#religion-southern-baptist').is(':checked');
  var united_church_of_christ = $('#religion-united-church-of-christ').is(':checked');
  var united_methodist = $('#religion-united-methodist').is(':checked');
  var unitarian_universalist = $('#religion-unitarian-universalist').is(':checked');
  var unspecified_religion = $('#religion-unspecified').is(':checked');

  $african_methodist.show();
  $anglican.show();
  $baptist.show();
  $buddhism.show();
  $christian.show();
  $christian_reformed.show();
  $christian_scientist.show();
  $church_of_christ.show();
  $church_of_god.show();
  $congregationalist.show();
  $deist.show();
  $eastern_orthodox.show();
  $episcopalian.show();
  $evangelical.show();
  $evangelical_lutheran.show();
  $hindu.show();
  $jewish.show();
  $jodo_shinshu_buddhist.show();
  $lutheran.show();
  $methodist.show();
  $mormon.show();
  $muslim.show();
  $nazarene_christian.show();
  $pentecostal.show();
  $presbyterian.show();
  $protestant.show();
  $roman_catholic.show();
  $seventh_day_adventist_church.show();
  $soka_gakkai_buddhist.show();
  $southern_baptist.show();
  $united_church_of_christ.show();
  $united_methodist.show();
  $unitarian_universalist.show();
  $unspecified_religion.show();

  // Hide Checkboxes for Options we don't need
  if($african_methodist.length === 0) {
    $('#religion-african-methodist').closest('label').hide();
  }
  if($anglican.length === 0) {
    $('#religion-anglican').closest('label').hide();
  }
  if($baptist.length === 0) {
    $('#religion-baptist').closest('label').hide();
  }
  if($buddhism.length === 0) {
    $('#religion-buddhism').closest('label').hide();
  }
  if($christian.length === 0) {
    $('#religion-christian').closest('label').hide();
  }
  if($christian_reformed.length === 0) {
    $('#religion-christian-reformed').closest('label').hide();
  }
  if($christian_scientist.length === 0) {
    $('#religion-christian-scientist').closest('label').hide();
  }
  if($church_of_christ.length === 0) {
    $('#religion-church-of-christ').closest('label').hide();
  }
  if($church_of_god.length === 0) {
    $('#religion-church-of-god').closest('label').hide();
  }
  if($congregationalist.length === 0) {
    $('#religion-congregationalist').closest('label').hide();
  }
  if($deist.length === 0) {
    $('#religion-deist').closest('label').hide();
  }
  if($eastern_orthodox.length === 0) {
    $('#religion-eastern-orthodox').closest('label').hide();
  }
  if($episcopalian.length === 0) {
    $('#religion-episcopalian').closest('label').hide();
  }
  if($evangelical.length === 0) {
    $('#religion-evangelical').closest('label').hide();
  }
  if($evangelical_lutheran.length === 0) {
    $('#religion-evangelical-lutheran').closest('label').hide();
  }
  if($hindu.length === 0) {
    $('#religion-hindu').closest('label').hide();
  }
  if($jewish.length === 0) {
    $('#religion-jewish').closest('label').hide();
  }
  if($jodo_shinshu_buddhist.length === 0) {
    $('#religion-jodo-shinshu-buddhist').closest('label').hide();
  }
  if($lutheran.length === 0) {
    $('#religion-lutheran').closest('label').hide();
  }
  if($methodist.length === 0) {
    $('#religion-methodist').closest('label').hide();
  }
  if($mormon.length === 0) {
    $('#religion-mormon').closest('label').hide();
  }
  if($muslim.length === 0) {
    $('#religion-muslim').closest('label').hide();
  }
  if($nazarene_christian.length === 0) {
    $('#religion-nazarene-christian').closest('label').hide();
  }
  if($pentecostal.length === 0) {
    $('#religion-pentecostal').closest('label').hide();
  }
  if($presbyterian.length === 0) {
    $('#religion-presbyterian').closest('label').hide();
  }
  if($protestant.length === 0) {
    $('#religion-protestant').closest('label').hide();
  }
  if($roman_catholic.length === 0) {
    $('#religion-roman-catholic').closest('label').hide();
  }
  if($seventh_day_adventist_church.length === 0) {
    $('#religion-seventh-day-adventist-church').closest('label').hide();
  }
  if($soka_gakkai_buddhist.length === 0) {
    $('#religion-soka-gakkai-buddhist').closest('label').hide();
  }
  if($southern_baptist.length === 0) {
    $('#religion-southern-baptist').closest('label').hide();
  }
  if($united_church_of_christ.length === 0) {
    $('#religion-united-church-of-christ').closest('label').hide();
  }
  if($united_methodist.length === 0) {
    $('#religion-united-methodist').closest('label').hide();
  }
  if($unitarian_universalist.length === 0) {
    $('#religion-unitarian-universalist').closest('label').hide();
  }
  if($unspecified_religion.length === 0) {
    $('#religion-unspecified').closest('label').hide();
  }

  // Handle LGTBQ
  var $lgbtq_no = $('.senator[data-lgbtq="no"]');
  var $lgbtq_lesbian = $('.senator[data-lgbtq="lesbian"]');
  var $lgbtq_gay = $('.senator[data-lgbtq="gay"]');
  var $lgbtq_bisexual = $('.senator[data-lgbtq="bisexual"]');
  var $lgbtq_transgender = $('.senator[data-lgbtq="transgender"]');
  var $lgbtq_queer = $('.senator[data-lgbtq="queer"]');

  var lgbtq_no = $('#lgbtq-no').is(':checked');
  var lgbtq_lesbian = $('#lgbtq-lesbian').is(':checked');
  var lgbtq_gay = $('#lgbtq-gay').is(':checked');
  var lgbtq_bisexual = $('#lgbtq-bisexual').is(':checked');
  var lgbtq_transgender = $('#lgbtq-transgender').is(':checked');
  var lgbtq_queer = $('#lgbtq-queer').is(':checked');

  $lgbtq_no.show();
  $lgbtq_lesbian.show();
  $lgbtq_gay.show();
  $lgbtq_bisexual.show();
  $lgbtq_transgender.show();
  $lgbtq_queer.show();

  // Hide Checkboxes for Options we don't need
  if($lgbtq_no.length === 0) {
    $('#lgbtq-no').closest('label').hide();
  }
  if($lgbtq_lesbian.length === 0) {
    $('#lgbtq-lesbian').closest('label').hide();
  }
  if($lgbtq_gay.length === 0) {
    $('#lgbtq-gay').closest('label').hide();
  }
  if($lgbtq_bisexual.length === 0) {
    $('#lgbtq-bisexual').closest('label').hide();
  }
  if($lgbtq_transgender.length === 0) {
    $('#lgbtq-transgender').closest('label').hide();
  }
  if($lgbtq_queer.length === 0) {
    $('#lgbtq-queer').closest('label').hide();
  }

  $('.show-filtering').hide();

  // Hide Unmatched Items
  if (senator || senate_majority_leader || senate_majority_whip || senate_minority_leader || senate_minority_whip) {
    if (!senator) {
      $senator.hide();
    }
    if (!senate_majority_leader) {
      $senate_majority_leader.hide();
    }
    if (!senate_majority_whip) {
      $senate_majority_whip.hide();
    }
    if (!senate_minority_leader) {
      $senate_minority_leader.hide();
    }
    if (!senate_minority_whip) {
      $senate_minority_whip.hide();
    }

    $('.show-filtering-title').show();
  }

  if (constitution || democrat || green || independent || libertarian || nonpartisan || republican) {
    if (!constitution) {
      $constitution.hide();
    }
    if (!democrat) {
      $democrat.hide();
    }
    if (!green) {
      $green.hide();
    }
    if (!independent) {
      $independent.hide();
    }
    if (!libertarian) {
      $libertarian.hide();
    }
    if (!nonpartisan) {
      $nonpartisan.hide();
    }
    if (!republican) {
      $republican.hide();
    }

    $('.show-filtering-party').show();
  }

  if (female || male || unspecified_gender) {
    if (!female) {
      $female.hide();
    }
    if (!male) {
      $male.hide();
    }
    if (!unspecified_gender) {
      $unspecified_gender.hide();
    }

    $('.show-filtering-gender').show();
  }

  if (african_american || asian_american || hispanic_american || middle_eastern_american || multi_racial_american || native_american || pacific_islander || white_american || unspecified) {
    if (!african_american) {
      $african_american.hide();
    }
    if (!asian_american) {
      $asian_american.hide();
    }
    if (!hispanic_american) {
      $hispanic_american.hide();
    }
    if (!middle_eastern_american) {
      $middle_eastern_american.hide();
    }
    if (!multi_racial_american) {
      $multi_racial_american.hide();
    }
    if (!native_american) {
      $native_american.hide();
    }
    if (!pacific_islander) {
      $pacific_islander.hide();
    }
    if (!white_american) {
      $white_american.hide();
    }
    if (!unspecified) {
      $unspecified.hide();
    }

    $('.show-filtering-ethnicity').show();
  }

  if (african_methodist || anglican || baptist || buddhism || christian || christian_reformed || christian_scientist || church_of_christ || church_of_god || congregationalist || deist || eastern_orthodox || episcopalian || evangelical || evangelical_lutheran || hindu || jewish || jodo_shinshu_buddhist || lutheran || methodist || mormon || muslim || nazarene_christian || pentecostal || presbyterian || protestant || roman_catholic || seventh_day_adventist_church || soka_gakkai_buddhist || southern_baptist || united_church_of_christ || united_methodist || unitarian_universalist || unspecified_religion) {
    if (!african_methodist) {
      $african_methodist.hide();
    }
    if (!anglican) {
      $anglican.hide();
    }
    if (!baptist) {
      $baptist.hide();
    }
    if (!buddhism) {
      $buddhism.hide();
    }
    if (!christian) {
      $christian.hide();
    }
    if (!christian_reformed) {
      $christian_reformed.hide();
    }
    if (!christian_scientist) {
      $christian_scientist.hide();
    }
    if (!church_of_christ) {
      $church_of_christ.hide();
    }
    if (!church_of_god) {
      $church_of_god.hide();
    }
    if (!congregationalist) {
      $congregationalist.hide();
    }
    if (!deist) {
      $deist.hide();
    }
    if (!eastern_orthodox) {
      $eastern_orthodox.hide();
    }
    if (!episcopalian) {
      $episcopalian.hide();
    }
    if (!evangelical) {
      $evangelical.hide();
    }
    if (!evangelical_lutheran) {
      $evangelical_lutheran.hide();
    }
    if (!hindu) {
      $hindu.hide();
    }
    if (!jewish) {
      $jewish.hide();
    }
    if (!jodo_shinshu_buddhist) {
      $jodo_shinshu_buddhist.hide();
    }
    if (!lutheran) {
      $lutheran.hide();
    }
    if (!methodist) {
      $methodist.hide();
    }
    if (!mormon) {
      $mormon.hide();
    }
    if (!muslim) {
      $muslim.hide();
    }
    if (!nazarene_christian) {
      $nazarene_christian.hide();
    }
    if (!pentecostal) {
      $pentecostal.hide();
    }
    if (!presbyterian) {
      $presbyterian.hide();
    }
    if (!protestant) {
      $protestant.hide();
    }
    if (!roman_catholic) {
      $roman_catholic.hide();
    }
    if (!seventh_day_adventist_church) {
      $seventh_day_adventist_church.hide();
    }
    if (!soka_gakkai_buddhist) {
      $soka_gakkai_buddhist.hide();
    }
    if (!southern_baptist) {
      $southern_baptist.hide();
    }
    if (!united_church_of_christ) {
      $united_church_of_christ.hide();
    }
    if (!united_methodist) {
      $united_methodist.hide();
    }
    if (!unitarian_universalist) {
      $unitarian_universalist.hide();
    }
    if (!unspecified_religion) {
      $unspecified_religion.hide();
    }

    $('.show-filtering-religion').show();
  }

  if (lgbtq_no || lgbtq_lesbian || lgbtq_gay || lgbtq_bisexual || lgbtq_transgender || lgbtq_queer) {
    if (!lgbtq_no) {
      $lgbtq_no.hide();
    }
    if (!lgbtq_lesbian) {
      $lgbtq_lesbian.hide();
    }
    if (!lgbtq_gay) {
      $lgbtq_gay.hide();
    }
    if (!lgbtq_bisexual) {
      $lgbtq_bisexual.hide();
    }
    if (!lgbtq_transgender) {
      $lgbtq_transgender.hide();
    }
    if (!lgbtq_queer) {
      $lgbtq_queer.hide();
    }

    $('.show-filtering-lgbtq').show();
  }

  var count = $('.senator:visible').length;
  var total = $('.senator').length;
  var percent = Math.round((count / total) * 100);

  $('#search-total').text(count);

  if (count !== total) {
    $('#search-total').show();
  } else {
    $('#search-total').hide();
  }

  $('span.count').text(count);
  $('span.total').text(total);
  $('span.percent').text(percent + '%');

  $('.senators').addClass('enabled');
  $('#loading').fadeOut();

  clearTimeout(lazyInterval);
  lazyInterval = setTimeout(LazyLoad.lazyLoadImages, 250);
}

window.addEventListener('keydown', function (e) {
  if (e.keyCode === 114 || ( e.ctrlKey && e.keyCode === 70) || ( isCommandPressed(e) && e.keyCode === 70) ) {
    e.preventDefault();
    openSearch();
  } else if (e.keyCode === 27) {
    closeSearch();
  }
});
