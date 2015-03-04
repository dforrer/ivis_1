
var width = window.innerWidth,
	height = window.innerHeight;

var svg = d3.select("body").append("svg")
	.attr("width", width)
	.attr("height", height);

var force = d3.layout.force()
	.gravity(.5)
	.distance(25)
	.charge(-100)
	.size([width, height]);

d3.json("data/Eva_Aeppli_JSON.json", function (error, json) {
	force
		.nodes(json.nodes)
		.start();

	var node = svg.selectAll(".node")
		.data(json.nodes)
		.enter().append("g")
		.filter(function(d) { return d.JAHR > 1000 })
		.attr("class", "node")
		.call(force.drag);

	node.append("circle")
		.attr("r", 8); // radius

	node.on("mouseover", function (d) {
		d3.selectAll(".node")
			.style({opacity:'0.1'})
		d3.select(this)
			.style({opacity:'1.0'});
		d3.select(this).append("text")
			.attr("id", "arcSelection")
			.style("font-size", 24)
			.attr("dx", 12)
			.attr("dy", ".35em")
			.text(function (d) {
				return d.TITEL + ", " + d.JAHR
			})
	})

	node.on("mouseout", function (d) {
		d3.selectAll(".node")
			.style({opacity:'1.0'});
		d3.select("#arcSelection").remove();
	});

	force.on("tick", function () {
		node.attr("transform", function (d) {
			return "translate(" + d.x + "," + d.y + ")";
		})
	});
});

