angular.module('browserStats')
.directive('ngViz', function ($firebase, D3Service) {
    return {
      restrict: 'A',
      scope: {},
      link: function (scope, element, attrs) {
        var fred = new Firebase('https://stites.firebaseio.com/Users/Fred');
        $firebase(fred).$on("loaded", function(dataObj) {
          var dataArray = [];

          for(var data in dataObj){
            dataArray.push(dataObj[data]);
          }

          var height = 600, width = 700;
          var svg = D3Service.createSvg(width, height, element[0]),
            tree = D3Service.createCluster(width, height),
            diagonal = D3Service.createDiagonal(),
            root = D3Service.generateNesting(dataArray)[0];

          var nodes = tree.nodes(root);
          var links = tree.links(nodes);

          var link = svg.selectAll(".link")
              .data(links)
            .enter().append("path")
              .attr("class", "link")
              .attr("d", diagonal);

          var node = svg.selectAll(".node")
              .data(nodes)
            .enter().append("g")
              .attr("class", "node")
              .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; })

          node.append("circle")
              .attr("r", 4.5);

          node.append("text")
              .attr("dx", function(d) { return d.children ? -8 : 8; })
              .attr("dy", 3)
              .style("text-anchor", function(d) { return d.children ? "end" : "start"; })
              .text(function(d) { return d.name; });

        });
      }
    }
  });
