angular.module('browserStats')
.directive('ngViz', function ($firebase, D3Service) {
    return {
      restrict: 'A',
      scope: {},
      link: function (scope, element, attrs) {
        var fred = new Firebase('https://stites.firebaseio.com/Users/Fred');
        var data = $firebase(fred);

        var height = 600;
        var width = 700;

        var svg = D3Service.createSvg(width, height, element[0])
        var dataSet = svg.selectAll('span').data([data]);
        var domElements = dataSet.enter().append('circle')
                        .attr({r:10, cx:width/2, cy:height/2})
                        .style('fill', 'orange');


      }
    }
  });
