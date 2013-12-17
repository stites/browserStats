
var margins = [20, 120, 20, 120],
    width = 1280 - margins[1] - margins[3],
    height = 800 - margins[0] - margins[2],
    i = 0,
    root;

var createSvg = function (height, width, margins) {
  var svg = d3.select(".body").append("svg:svg")
      .attr("height", height + margins[0] + margins[2])
      .attr("width", width + margins[1] + margins[3])
      // Namespacing - wut?
      .append("svg:g")
      .attr("transform", "translate(" + margins[3] + "," + margins[0] + ")");
  return svg;
};

var createTreeLayout = function (height, width) {
  return d3.layout.tree()
    .size([height, width - 160])
    .children(function(d){
      // TODO: CHANGE THIS TO d.values WHEN USING NESTING
      return (!d.children || d.children.length === 0) ? null : d.children;
    });
};

var createDiagonal= function () {
  return d3.svg.diagonal().projection(function(d) { return [d.y, d.x]; });
};

var generateNesting= function (array) {
  return d3.nest()
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
      return d.topic;
    })
    .entries(array);
};


function collapseAllFromRootExcept(root, d) {
  while(d.depth > 0){
    for (var i = 0; i < d.parent.children.length; i++) {
      if (d.parent.children[i] === d) break;
      collapse(d.parent.children[i]);
    }
    d = d.parent;
  }
}

function collapseAll(d) {
  if (d.children) {
    d.children.forEach(collapseAll);
    collapse(d);
  }
}

function collapse (d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  }
}

function toggleAll(d) {
  if (d.children) {
    d.children.forEach(toggleAll);
    toggle(d);
  }
}

function toggle(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
}


var tree = createTreeLayout(height, width);
var diagonal = createDiagonal();
var svgCanvas = createSvg(height, width, margins);

root = json;
root.x0 = height / 2;
root.y0 = 0;

// Initialize the display to show a few nodes.
// root.children.forEach(toggleAll);
// toggle(root.children[1]);
// toggle(root.children[1].children[2]);
// toggle(root.children[9]);
// toggle(root.children[9].children[0]);

update(root);

function update(source) {
  var duration = 500;
  var nodes = tree.nodes(root);

  nodes.forEach(function(d) { d.y = d.depth * 200; });

  // Update the nodes…
  var node = svgCanvas.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("svg:g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .on("click", function(d) {
        // collapseAllFromRootExcept(root, d);
        toggle(d);
        update(d);
      });

  nodeEnter.append("svg:circle")
      .attr("r", 1e-6)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

  nodeEnter.append("svg:text")
      .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
      .attr("dy", ".35em")
      .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
      .text(function(d) { return d.name; })
      .style("fill-opacity", 1e-6);

  // Transition nodes to their new position.
  var nodeUpdate = node.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  nodeUpdate.select("circle")
      .attr("r", 4.5)
      .style("fill", function(d) { return d._children ? "lightsteelblue" : "#fff"; });

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

  // Update the links…
  var link = svgCanvas.selectAll("path.link")
      .data(tree.links(nodes), function(d) { return d.target.id; });

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
  link.exit().transition()
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