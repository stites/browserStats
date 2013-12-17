angular.module('browserStats')
.directive('ngViz', function (D3Service) {
    return {
      restrict: 'A',
      scope: {},
      link: function (scope, element, attrs) {
        debugger;
        var svg = D3Service.createSvg(960, 600, element[0]);
        var elements = svg.append('g').selectAll('texts').data(data);
        elements.enter().append('circle').attr({
          r: 10
        });
      }
    }
  })
