// var sendHistoryToDataBase = function () {

//   var microsecondsPerDay = 1000 * 60 * 60 * 24 * 1;
//   var oneDayAgo = (new Date).getTime() - microsecondsPerDay;

//   chrome.history.search({
//     'text': '',
//     'startTime': oneDayAgo
//   },
//   function(historyItems) {
//     for (var i = 0; i < historyItems.length; ++i) {
//       addToFirebase(historyItems[i], historyItems[i].lastVisitTime);
//     }
//   });
// };
// var sendNavigationToDatabase = function (details) {
//   addToFirebase(details, details.timeStamp);
// }

// var addToFirebase = function (item, id) {
//   var fred = new Firebase('https://stites.firebaseio.com/Users/Fred');

//   fred.auth('Eo85u1MXfxVA4udvqIdjnyTYkL51Zz0AFABP962M', function(error, result) {
//     if(error) {
//       console.log("Login Failed!", error);
//     } else {
//       console.log('Authenticated successfully with payload:', result.auth);
//       console.log('Auth expires at:', new Date(result.expires * 1000));
//     }
//   });
//   debugger;
//   fred.child(Math.round(id)).set(item);
// };

// document.addEventListener('DOMContentLoaded', function () {
//   // sendHistoryToDataBase();
//   alert('initiated!');
//   chrome.webNavigation.onCompleted.addListener(function (detailObject) {
//     alert(detailedObject);
//     sendNavigationToDatabase(detailObject);
//   });
// });

// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Called when the url of a tab changes.
function checkForValidUrl(tabId, changeInfo, tab) {
  // If the letter 'g' is found in the tab's URL...
  if (tab.url.indexOf('g') > -1) {
    // ... show the page action.
    chrome.pageAction.show(tabId);
  }
};

// Listen for any changes to the URL of any tab.
chrome.windows.onCreated.addListener(function (curWindow) {
  // chrome.webNavigation.onCompleted(alert);
  alert(curWindow);
})