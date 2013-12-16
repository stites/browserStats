angular.module('browserStats')

.controller('UserStats', function($scope, $http){
  var fred = new Firebase('https://stites.firebaseio.com/Users/Fred');

  //Log me in
  fred.auth('Eo85u1MXfxVA4udvqIdjnyTYkL51Zz0AFABP962M', function(error, result) {
    if(error) {
      console.log("Login Failed!", error);
    } else {
      console.log('Authenticated successfully with payload:', result.auth);
      console.log('Auth expires at:', new Date(result.expires * 1000));
    }
  });

  $scope.sort = "-visits";
  $http({
    method: 'GET',
    url: '/links'
  }).success(function(data) {
    $scope.links = data;
  });
});