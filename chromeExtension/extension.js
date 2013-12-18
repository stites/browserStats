var sendHistoryToDataBase = function () {

  var microsecondsPerDay = 1000 * 60 * 60 * 24 * 1;
  var oneDayAgo = (new Date).getTime() - microsecondsPerDay;

  chrome.history.search({
    'text': '',
    'startTime': oneDayAgo
  },
  function(historyItems) {
    for (var i = 0; i < historyItems.length; ++i) {
    // for (var i = 0; i < 10; ++i) {
      addToFirebase(historyItems[i], historyItems[i].lastVisitTime);
    }
  });
};
var sendNavigationToDatabase = function (details) {
  addToFirebase(details, details.timeStamp);
}

var addToFirebase = function (item, id) {
  $.ajax({
    url: 'http://127.0.0.1:3000',
    type: 'POST',
    data: {
        // url: 'https://encrypted.google.com/search?hl=en&source=hp&q=testing&btnG=Google+Search&aq=f&aqi=g10&aql=&oq=&gs_rfai='
        url: item.url
    },
    success: function(topic) {
      var fred = new Firebase('https://stites.firebaseio.com/Users/Fred');

      fred.auth('Eo85u1MXfxVA4udvqIdjnyTYkL51Zz0AFABP962M');
      item.topic = topic;
      fred.child(Math.round(id)).set(item);
    },
    error: function (reason) {
      console.log('error',reason);
    }
  });
};

document.addEventListener('DOMContentLoaded', function () {
  sendHistoryToDataBase();

  // ::::ADD IN INTERACTIVE USER BROWSING::::
  // chrome.webNavigation.onCompleted.addListener(function (detailObject) {
  //   alert(detailedObject);
  //   sendNavigationToDatabase(detailObject);
  // });
});
