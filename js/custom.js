Array.prototype.contains = function (obj) {
	var i = this.length;
	while (i--) {
		if (this[i] === obj) {
			return true;
		}
	}
	return false;
}

var selectedColors = [];
;

var width = 670,
	height = 600;

var svg = d3.select("body").select("#graph").append("svg")
	.attr("width", width)
	.attr("height", height);

svg.append("text").

	var
force = d3.layout.force()
	.friction(0.9)
	.linkDistance(20)
	.charge(-60)
	.gravity(0.40)
	.size([width, height]);

var nodes = force.nodes(),
	links = force.links(),
	node = svg.selectAll(".node"),
	link = svg.selectAll(".link");

d3.json("data/Eva_Aeppli_JSON.json", function (error, json) {
	force
		.nodes(json.nodes)
		.start();


	var items = svg.selectAll(".node")
		.data(json.nodes)
		.enter().append("g")
//		.filter(function(d) { return d.JAHR > 1000 })
		.attr("class", "node")
		.call(force.drag);

	items.append("circle")
		.attr("r", 8); // radius
	items.on("mouseover", function (d) {
		var groupCount = items.size() / d.FARBEN.length;
		for (var i = 0; i < d.FARBEN.length; i++) {
			var farbe = d.FARBEN[i];
			//console.log(farbe);
			//console.log(nodes);
			//console.log("i*groupCount: " + Math.floor(i*groupCount));
			//console.log("i+1*groupCount: " + Math.floor((i+1)*groupCount));

			d3.selectAll(".node")
				.filter(function (d, j) {
					return (j >= Math.floor(i * groupCount) && j < Math.floor((i + 1) * groupCount));
				})
				.select("circle")
				.style("stroke-width", "0px")
				.style({fill: "#" + farbe});
		}
		d3.select(this).select("circle")
			.style({fill: "#ffffff"})
			.style("stroke-width", "3px");
		document.getElementById("title").innerText = d.TITEL;
		document.getElementById("year").innerText = d.JAHR;
		document.getElementById("filename").innerText = d.FILENAME;
		document.getElementById("picture").src = "images/" + d.FILENAME + ".jpg";
		/*		d3.select(this).append("text")
		 .attr("id", "arcSelection")
		 .style("font-size", 13)
		 .style("font-weight", "bold")
		 .attr("dx", 12)
		 .attr("dy", ".35em")
		 .text(function (d) {
		 return d.TITEL + ", " + d.JAHR + ", " + d.FILENAME
		 })*/
	})


	items.on("mouseout", function (d) {
		filterByColor(d)
	});

	// Reference: http://bl.ocks.org/mbostock/929623
	items.on("click", function (source) {
		/*
		 links.length = 0; // Clear array
		 for (var i = 0; i < source.FARBEN.length; i++) {
		 var farbe = source.FARBEN[i];
		 //console.log(farbe);
		 //console.log(nodes);
		 //console.log("i*groupCount: " + Math.floor(i*groupCount));
		 //console.log("i+1*groupCount: " + Math.floor((i+1)*groupCount));

		 items.data()
		 .filter(function (d2) {
		 var a = d2.FARBEN;
		 var index = 0;
		 var found = false;
		 var entry;
		 for (index = 0; index < a.length; ++index) {
		 entry = a[index];
		 if (entry == farbe) {
		 found = true;
		 break;
		 }
		 }
		 return found;
		 })
		 .forEach(function (target) {
		 //if (!links.contains({source: source, target: target})){
		 links.push({source: source, target: target});
		 //}
		 });
		 }
		 */
		//restart();
	});

	var colors = json.colors;
	for (var i = 0; i < colors.length; i++) {
		var obj = colors[i];
		console.log("Color =" + obj);
		svg.append("rect")
			.attr("class", "square")
			.attr("x", i * 10)
			.attr("y", 0)
			.attr("width", 10)
			.attr("height", 10)
			.style({fill: "#" + obj});
	}

	filterByColor = function (d) {
		d3.selectAll(".node").select("circle")
			.style({fill: "#dddddd"});
		if (selectedColors.length > 0) {
			// 1. Make all circles gray

			// 2. Color the circles that contain all the colors in selectedColors
			d3.selectAll(".node")
				.filter(function (d) {
					//console.log(d);
					var index = 0;
					for (index = 0; index < selectedColors.length; ++index) {
						if (!d.FARBEN.contains(selectedColors[index])) {
							return false;
						}
					}
					return true;
				})
				.select("circle")
				.style("stroke-width", "0px")
				.style({fill: "#ff0000"});
		}
		/*
		 d3.selectAll(".node")
		 .style({opacity:'1.0'});
		 d3.selectAll(".node").select("circle")
		 .attr("r", 8);
		 d3.select("#arcSelection").remove();
		 */
	}


	var squares = svg.selectAll(".square").data(colors);
	squares.on("click", function (d) {
		if (selectedColors.contains(d)){
			selectedColors.pop(d);
			d3.select(this).attr("height", 10);
		} else {
			selectedColors.push(d);
			d3.select(this).attr("height", 25);
		}
		filterByColor(items);
		console.log("selectedColors: " + selectedColors);
	});


	tick_normal = function () {
		items.attr("transform", function (d) {
			var border = 10;

			if (d.x < border) {
				d.x = border;
			} else if (d.x > width - border) {
				d.x = width - border;
			}

			if (d.y < border) {
				d.y = border;
			} else if (d.y > height - border) {
				d.y = height - border;
			}

			return "translate(" + d.x + "," + d.y + ")";
		})
		link.attr("x1", function (d) {
			return d.source.x;
		})
			.attr("y1", function (d) {
				return d.source.y;
			})
			.attr("x2", function (d) {
				return d.target.x;
			})
			.attr("y2", function (d) {
				return d.target.y;
			});
	}

	force.on("tick", tick_normal);
});


function restart() {
	console.log(links);
	link = link.data(links);

	//link.enter().insert("line", ".node")
	//	.attr("class", "link");

	force.start();
}

