angular.module('d3', [])
.factory('D3Service', function () {
  var service = {
    createSvg: function (width, height, element) {
      var width = width;
      var height = height;
      var svg = d3.select(element).append('svg').attr({
        'width': width,
        'height': height
        })
        .append('g')
        .attr("transform", "translate(40,0)");
      return svg;
    }
  };

  return service;
});