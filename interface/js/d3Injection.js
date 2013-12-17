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
    },
    createCluster: function (width, height) {
      var width = width;
      var height = height;
      var cluster = d3.layout.cluster().size([height, width - 160]);
      return cluster;
    },
    createDiagonal: function () {
      var diagonal = d3.svg.diagonal()
          .projection(function(d) { return [d.y, d.x]; });
      return diagonal;
    }
  };

  return service;
});