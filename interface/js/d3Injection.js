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
      var tree = d3.layout.tree()
          .size([height, width - 160])
          .children(function(d){
              return (!d.values || d.values.length === 0) ? null : d.values;
          });
      return tree;
    },
    createDiagonal: function () {
      var diagonal = d3.svg.diagonal()
          .projection(function(d) { return [d.y, d.x]; });
      return diagonal;
    },
    generateNesting: function (array) {
      var nest = d3.nest()
        .key(function(d) {
          return '24-hourSession';
        })
        .key(function(d) {
          return (new Date(d.lastVisitTime)).getDay();
        })
        .key(function(d) {
          return (new Date(d.lastVisitTime)).getHours();
        })
        .key(function(d) {
          var domainAndSpecifics = d.url.split('://')[1];
          var domain = domainAndSpecifics.split(/(?:.com)|(?:.org)|(?:.net)/)[0];
          return domain;
        })
        .entries(array);
      return nest;
    }
  };

  return service;
});