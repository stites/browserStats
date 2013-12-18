var margins = [20, 120, 20, 120],
  width = window.innerWidth - margins[1] - margins[3],
  height = window.innerHeight - margins[0] - margins[2],
  i = 0,
  root;

var createSvg = function (height, width, margins) {
  var svg = d3.select("body").append("svg:svg")
      .attr("height", height + margins[0] + margins[2])
      .attr("width", width + margins[1] + margins[3])
      .append("svg:g")
      .attr("transform", "translate(" + (margins[3]+300) + "," + margins[0] + ")");
  return svg;
};

var createTreeLayout = function (height, width) {
  return d3.layout.tree()
    .size([height, width - 160])
    .children(function(d){
      return (!d.values || d.values.length === 0) ? null : d.values;
    });
};

var createDiagonal= function () {
  return d3.svg.diagonal().projection(function(d) { return [d.y, d.x]; });
};

var generateNesting= function (array) {
  return d3.nest()
    .key(function(d) {
      return 'Hackathon Session';
    })
    .key(function(d) {
      return d.topic;
    })
    .key(function(d) {
      return (new Date(d.lastVisitTime)).getHours()+':00';
    })
    .entries(array);
};

var toggleAll = function (d) {
  if (d.values) {
    d.values.forEach(toggleAll);
    toggle(d);
  }
};

var toggle = function (d) {
  if (d.values) {
    d._values = d.values;
    d.values = null;
  } else {
    d.values = d._values;
    d._values = null;
  }
}

var tree = createTreeLayout(height, width);
var diagonal = createDiagonal();
var svgCanvas = createSvg(height, width, margins);
var duration = 500;

var update = function (source) {

  var nodes = tree.nodes(root);
  nodes.forEach(function(d) {
    d.children = d.values;
    d.key = d.key || d.title;
    d.y = d.depth * 200;
    d.id = 0;
  });

  // Update the nodes with ids for links
  var node = svgCanvas.selectAll("g.node")
      .data(nodes, function(d) {
        return d.id || (d.id = ++i);
      });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("svg:g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .on("click", function(d) {
        toggleDetails(d);
        toggle(d);
        update(d);
      });

  nodeEnter.append("svg:circle")
      .attr("r", 1e-6)
      .style("fill", function(d) { return d._values ? "lightsteelblue" : "#fff"; });

  nodeEnter.append("svg:text")
      .attr("x", function(d) { return d.values || d._values ? -10 : 10; })
      .attr("dy", ".35em")
      .attr("text-anchor", function(d) { return d.values || d._values ? "end" : "start"; })
      .text(function(d) { return d.key; })
      .style("fill-opacity", 1e-6);

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  nodeUpdate.select("circle")
      .attr("r", 4.5)
      .style("fill", function(d) { return d._values ? "lightsteelblue" : "#fff"; });

  nodeUpdate.select("text")
      .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      .remove();

  nodeExit.select("circle")
      .attr("r", 1e-6);

  nodeExit.select("text")
      .style("fill-opacity", 1e-6);

  var links = tree.links(nodes);
  var link = svgCanvas.selectAll("path.link")
      .data(links, function(d) {
        return d.target.id;
      });

  // Enter any new links at the parent's previous position.
  link.enter().insert("svg:path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};
        return diagonal({source: o, target: o});
      })
    .transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition links to their new position.
  link.transition()
      .duration(duration)
      .attr("d", diagonal);

  // Transition exiting nodes to the parent's new position.
  link.exit()
      .transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
        return diagonal({source: o, target: o});
      })
      .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
};

var toggleDetails = function (datum) {
  if (datum._values) {
    if (datum._values[0].url){
      for (var i = 0; i < datum._values.length; i++) {
          var title = (datum._values[i].title) && (datum._values[i].title).substring(0,60);
          d3.select(".stats")
              .append('div')
              .html('<div class="info">'+
                      '<div class="title"><a href="'+datum._values[i].url+'" target="_blank">'+title+'</a></div>'+
                      '<div class="typedCount">typedCount: '+datum._values[i].typedCount+' </div>'+
                      '<div class="visitCount">visitCount: '+datum._values[i].visitCount+'</div>'+
                      '<div class="topic">topic: '+datum._values[i].topic+'</div></div>')
              .style('margin', '10px')
              .style('color', 'white');
      }
    } else {
      // Maybe for another time
      // ======================
      // d3.select(".stats")
      //       .append('div')
      //       .text(datum.key)
      //       .style('margin', '10px')
      //       .style('color', 'white');
    }
  } else {
    // Actually use databinding for this one
    // =====================================
    // if (datum.values[0].url){
    //   for (var i = 0; i < datum._values.length; i++) {
    //       d3.select(".stats")
    //           .append('div')
    //           .text(datum._values[i].title)
    //           .style('margin', '10px')
    //           .style('color', 'white');
    //    }
    // }
  }
}


var fred = new Firebase('https://stites.firebaseio.com/Users/Fred');
fred.auth('Eo85u1MXfxVA4udvqIdjnyTYkL51Zz0AFABP962M', function(error, result) {
  if(error) {
    console.log("Login Failed!", error);
  } else {
    console.log('Authenticated successfully with payload:', result.auth);
    console.log('Auth expires at:', new Date(result.expires * 1000));
  }
});

fred.on("value", function(fb) {
  var nodeArray = [];
  for(var data in fb.val()){
    var datum = fb.val()[data];
    nodeArray.push(datum);
  }

  root = generateNesting(nodeArray)[0];
  root.x0 = height / 2;
  root.y0 = 0;
  root.values.forEach(toggleAll);
  update(root);
});
