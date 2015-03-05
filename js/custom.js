
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

	var items = svg.selectAll(".node")
		.data(json.nodes)
		.enter().append("g")
		.filter(function(d) { return d.JAHR > 1000 })
		.attr("class", "node")
		.call(force.drag);

	items.append("circle")
		.attr("r", 8); // radius

	items.on("mouseover", function (d) {
		var nodes = d3.selectAll(".node");
		var groupCount = nodes.size()/d.FARBEN.length;
		for (var i = 0; i < d.FARBEN.length; i++) {
			var obj = d.FARBEN[i];
			console.log(obj);
			console.log(nodes);
			console.log("i*groupCount: " + Math.floor(i*groupCount));
			console.log("i+1*groupCount: " + Math.floor((i+1)*groupCount));

			d3.selectAll(".node")
				.filter(function (d, j) {
					return (j>= Math.floor(i*groupCount) && j < Math.floor((i+1)*groupCount));
				})
				.select("circle")
				.style({fill:"#"+obj});
		}
		d3.select(this).select("circle")
			.attr("r", 12);
		d3.select(this)
			.transition()
			.style({opacity:'1.0'});
		d3.select(this).append("text")
			.attr("id", "arcSelection")
			.style("font-size", 13)
			.style("font-weight", "bold")
			.attr("dx", 12)
			.attr("dy", ".35em")
			.text(function (d) {
				return d.TITEL + ", " + d.JAHR + ", " + d.FILENAME
			})
	})

	items.on("mouseout", function (d) {
		d3.selectAll(".node")
			.transition()
			.style({opacity:'1.0'});
		d3.selectAll(".node").select("circle")
			.attr("r", 8);
		d3.select("#arcSelection").remove();
	});

	force.on("tick", function () {
		items.attr("transform", function (d) {
			return "translate(" + d.x + "," + d.y + ")";
		})
	});
});

