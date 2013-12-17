var sendHistoryToDataBase = function () {

  var microsecondsPerDay = 1000 * 60 * 60 * 24 * 1;
  var oneDayAgo = (new Date).getTime() - microsecondsPerDay;

  chrome.history.search({
    'text': '',
    'startTime': oneDayAgo
  },
  function(historyItems) {
    for (var i = 0; i < historyItems.length; ++i) {
      addToFirebase(historyItems[i], historyItems[i].lastVisitTime);
    }
  });
};
var sendNavigationToDatabase = function (details) {
  addToFirebase(details, details.timeStamp);
}

var addToFirebase = function (item, id) {
  var fred = new Firebase('https://stites.firebaseio.com/Users/Fred');

  fred.auth('Eo85u1MXfxVA4udvqIdjnyTYkL51Zz0AFABP962M', function(error, result) {
    if(error) {
      console.log("Login Failed!", error);
    } else {
      console.log('Authenticated successfully with payload:', result.auth);
      console.log('Auth expires at:', new Date(result.expires * 1000));
    }
  });

  // CHANGE TO TOPIC ANALYSIS IN LATER VERSION - lols
  (function addTopic (obj) {
    var choices = ['kittens', 'hackathons', 'bear hunting', 'the biggest shirt in the world'];
    obj.topic = choices[Math.floor(Math.random() * choices.length)];
  })(item);

  fred.child(Math.round(id)).set(item);
};

document.addEventListener('DOMContentLoaded', function () {
  sendHistoryToDataBase();

  // ::::ADD IN INTERACTIVE USER BROWSING::::
  // chrome.webNavigation.onCompleted.addListener(function (detailObject) {
  //   alert(detailedObject);
  //   sendNavigationToDatabase(detailObject);
  // });
});
