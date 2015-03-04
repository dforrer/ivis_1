
var width = window.innerWidth,
	height = window.innerHeight;
/*
 var tooltip = d3.select("body")
 .append("div")
 .style("position", "absolute")
 .style("z-index", "10")
 .style("visibility", "hidden")
 .text("a simple tooltip");
 */
var svg = d3.select("body").append("svg")
	.attr("width", width)
	.attr("height", height);

var force = d3.layout.force()
	.gravity(.5)
	.distance(25)
	.charge(-100)
	.size([width, height]);
/*
 .on("mouseover", function(){return tooltip.style("visibility", "visible");})
 .on("mousemove", function(){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
 .on("mouseout", function(){return tooltip.style("visibility", "hidden");});
 */
d3.json("data/Eva_Aeppli_JSON.json", function (error, json) {
	force
		.nodes(json.nodes)
		.links(json.links)
		.start();


	var link = svg.selectAll(".link")
		.data(json.links)
		.enter().append("line")
		.attr("class", "link");

	var node = svg.selectAll(".node")
		.data(json.nodes)
		.enter().append("g")
		.attr("class", "node")
		.call(force.drag);

	node.append("circle")
		.attr("r", 6); // radius

	node.on("mouseover", function (d) {
		d3.select(this).append("text")
			.attr("id", "arcSelection")
			.style("z-index", 10000000)
			.style("font-size", 24)
			.attr("dx", 12)
			.attr("dy", ".35em")
			.text(function (d) {
				return d.TITEL + ", " + d.DATIERUNG
			})
	})

	node.on("mouseout", function (d) {
			d3.select("#arcSelection").remove();
		});

	force.on("tick", function () {
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
		node.attr("transform", function (d) {
			return "translate(" + d.x + "," + d.y + ")";
		})
	});
});