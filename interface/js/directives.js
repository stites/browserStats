angular.module('browserStats')
.directive('ngViz', function ($firebase, D3Service) {
    return {
      restrict: 'A',
      scope: {},
      link: function (scope, element, attrs) {
        var fred = new Firebase('https://stites.firebaseio.com/Users/Fred');
        var treeData = new Tree();

        $firebase(fred).$on("loaded", function(dataObj) {
          for(var data in dataObj){
            treeData.addChild(dataObj[data]);
          }
        });

        var height = 600;
        var width = 700;
        var svg = D3Service.createSvg(width, height, element[0]);
        var cluster = D3Service.createCluster(width, height);
        var diagonal = D3Service.createDiagonal();

        var dataSet = svg.selectAll('span').data([{val:0}]);

        var domElements = dataSet.enter().append('circle')
                        .attr({r:10, cx:width/2, cy:height/2})
                        .style('fill', 'orange');

      }
    }
  });
