var sendToDataBase = function () {

  var microsecondsPerDay = 1000 * 60 * 60 * 24 * 1;
  var oneDayAgo = (new Date).getTime() - microsecondsPerDay;

  chrome.history.search({
    'text': '',
    'startTime': oneDayAgo
  },
  function(historyItems) {
    for (var i = 0; i < historyItems.length; ++i) {
      addToFirebase(historyItems[i]);
    }
  });
};

var addToFirebase = function (histItem) {
  var fred = new Firebase('https://stites.firebaseio.com/Users/Fred');

  fred.auth('Eo85u1MXfxVA4udvqIdjnyTYkL51Zz0AFABP962M', function(error, result) {
    if(error) {
      console.log("Login Failed!", error);
    } else {
      console.log('Authenticated successfully with payload:', result.auth);
      console.log('Auth expires at:', new Date(result.expires * 1000));
    }
  });
  fred.child(Math.round(histItem.lastVisitTime)).set(histItem);
};

document.addEventListener('DOMContentLoaded', function () {
  sendToDataBase();
});