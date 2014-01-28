
$(document).ready(function() {
  var addItems, autoScroll, getAgoFromCreatedDate, getAgoString, populateTimeline, replaceURLWithHTMLLinks, unitHelper;
  populateTimeline = function() {
    var timeline;
    timeline = void 0;
    $.get("/lib/twork.php", function(data) {}).success(function(data) {
      return $.each(data.statuses, function(k, v) {
        var items;
        if ((v.lang === "en") && (v.possibly_sensitive !== true)) {
          items = [];
          items.push("<div class=\"screen_name\"><a href=\"http://www.twitter.com/" + v.user.screen_name + "\" target=\"newWindow_" + v.user.screen_name + "\">@" + v.user.screen_name + "</a></div>");
          items.push("<div class=\"body\">" + replaceURLWithHTMLLinks(v.text) + "</div>");
          items.push("<div class=\"posted-at\">" + getAgoFromCreatedDate(v.created_at) + "</div>");
          items.push("<div class=\"divider\">&nbsp;</div>");
          return addItems("#twitter-feed .wrapper .container .tweets", items);
        }
      });
    }).always(function() {
      return autoScroll();
    });
    return false;
  };
  getAgoFromCreatedDate = function(dateString) {
    var ago, posted_date, todays_date;
    todays_date = new Date().getTime();
    posted_date = new Date(dateString).getTime();
    ago = (todays_date - posted_date) / 1000;
    return getAgoString(ago);
  };
  getAgoString = function(ago) {
    var response;
    response = unitHelper("minute", 60, ago);
    if (response) {
      return response;
    }
    response = unitHelper("hour", 3600, ago);
    if (response) {
      return response;
    }
    response = unitHelper("day", 86400, ago);
    if (response) {
      return response;
    }
    response = unitHelper("month", 2419200, ago);
    if (response) {
      return response;
    }
    return "unknown";
  };
  unitHelper = function(unit, limit, ago) {
    var units, units_ago;
    units = {
      minute: 60,
      hour: 3600,
      day: 86400,
      month: 2419200
    };
    units_ago = Math.floor(ago / units[unit]);
    if (units_ago < limit) {
      if (units_ago < 1) {
        return "less than 1 " + unit + " ago";
      } else if (units_ago < 2) {
        return units_ago + " " + unit + " ago";
      } else {
        return units_ago + " " + unit + "s ago";
      }
    } else {
      return false;
    }
  };
  addItems = function(target_elem, items) {
    var new_elem;
    new_elem = $("<div class=\"tweet\"></div>");
    $.each(items, function(k, v) {
      return $(new_elem).append(v);
    });
    return $(target_elem).append(new_elem);
  };
  replaceURLWithHTMLLinks = function(text) {
    var exp;
    exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/i;
    return text.replace(exp, "<a href='$1'>$1</a>");
  };
  autoScroll = function() {
    var i, tweets;
    tweets = $("#twitter-feed .tweets .tweet");
    i = 0;
    return setInterval((function() {
      $(tweets[i]).find("*").fadeTo(500, 0, function() {
        return $(this).hide(300);
      });
      i++;
      if (i > (tweets.length - 4)) {
        i = 0;
        return $.each(tweets, function(k, v) {
          $(this).show();
          $(this).find("*").css("display", "block");
          return $(this).find("*").css("opacity", "1.0");
        });
      }
    }), 6000);
  };
  return populateTimeline();
});

