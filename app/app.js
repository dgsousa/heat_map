import * as d3 from 'd3';

(function() {

	var height = 600;
	var	 width = 1250
	var padding = 150 

	var monthNames = [null, "January", "February", "March", "April", "May", "June",
  					  "July", "August", "September", "October", "November", "December"];

  	var colors = ["#5E4FA2", "#3288BD", "#66C2A5", "#ABDDA4", "#E6F598", "#FFFFBF", "#FEE08B", "#FDAE61", "#F46D43", "#D53E4F", "#9E0142"]

  	var tempLevels = [0, 2.7, 3.9, 5, 6.1, 7.2, 8.3, 9.4, 10.5, 11.6, 12.7]

  	

  	
  	var heatColor = function(num) {
  		var temp = num + 8.66;
  		for(var i = 1; i < tempLevels.length; i++) {
  			if(temp < tempLevels[i]) {
  				break;
  			}
  		}
  		return colors[i - 1];
  	}

	var canvas = d3.select('.heat_map')
				   .append('svg')
				   .attr("height", height + padding * 2)
				   .attr("width", width + padding * 2)
				   .style("margin", "auto")
				   .append("g")
				   .attr("transform", "translate(" + padding + "," + padding + ")")


	var header = d3.select("svg")
				   .append("text")
				   .text("Monthly Global Land-Surface Temperature")
				   .attr("font-size", "40px")
				   .attr("font-weight", "bold")
				   .attr("dx", 350)
				   .attr("dy", 50)
	
	var subHeader = d3.select("svg")
					  .append("text")
				   	  .text("1753 - 2015")
				      .attr("font-size", "28px")
				      .attr("dx", 650)
				      .attr("dy", 80)

	var firstByLine = d3.select("svg")
				  	    .append("text")
				  	    .text("Temperatures are in Celsius and reported as anomolies relative to the Jan 1951 - Dec 1980 average.")
				  	    .attr("font-size", "16px")
				  	    .attr("dx", 400)
				        .attr("dy", 100)

	var secondByLine = d3.select("svg")
				  	    .append("text")
				  	    .text("Estimated Jan 1951-Dec 1980 absolute temperature ℃: 8.66 +/- 0.07")
				  	    .attr("font-size", "16px")
				  	    .attr("dx", 500)
				        .attr("dy", 120)

	
	var yScale = d3.scaleLinear()
				   .range([600, 0])

	var xScale = d3.scaleLinear()
				   .range([0, 1250])

	var yAxis = d3.axisLeft(yScale)
				  .ticks(13)
				  .tickFormat(function(num) {
				  	return monthNames[num];
				  })
				  .tickSize(0)



	var xAxis = d3.axisBottom(xScale)
				  .ticks(20)
				  .tickFormat(function(num) {
				  	return "" + num;
				  })
				  .tickSize(18)



	d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/global-temperature.json", function(err, data) {
		if(err) console.log(err)
		else {

			
			yScale.domain([0, d3.max(data.monthlyVariance, function(d) {
				return d.month;
			})])

			xScale.domain(d3.extent(data.monthlyVariance, function(d) {
				return d.year;
			}))

			var years = [];
			data.monthlyVariance.forEach(function(element) {
				if(years.indexOf(element.year) === -1) {
					years.push(element.year)
				}
			})



			
			var months = canvas.selectAll("g")
								.data(data.monthlyVariance)
								.enter()
								.append("g")
								.attr("fill", function(d) {
									return heatColor(d.variance)
								})
								.attr("transform", function(d) {
									var x = xScale(d.year)
									var y = yScale(d.month)
									return "translate(" + x + "," + y + ")";
								})
								

						  months.append("rect")
						  		.attr("width", width/years.length)
								.attr("height", height/12)
								.on("mouseover", function() {
				       	  			return tooltip.style("visibility", "visible")
				       	  		})
				       	  		.on("mouseout", function() {
				       	  			return tooltip.style("visibility", "hidden")
				       	  		})
				       	  		.on("mousemove", function(d) {
				       	  			return tooltip.style("top", (event.pageY - 130) + "px").style("left", (event.pageX - 100) + "px")
				       	  						  .html("<h2>" + d.year + " - " + monthNames[d.month] + "</h2><br><h3>" 
				       	  						  			   + (d.variance + 8.66) + "&#8451;</h3><br><h4>"
				       	  						  			   + (d.variance) + "&#8451;</h4>")
				       	  		})


						  canvas.append("g")
						  		.attr("class", "y-axis")
						  		.call(yAxis)
						  		.selectAll("text")
						  		.attr("dx", -10)
						  		.attr("dy", 30)
						  		.attr("font-size", "16px")
						  		

					       canvas.select(".y-axis")
					       		 .append("text")
					       		 .text("Months")
					       		 .attr("font-size", "24px")
					       		 .attr("stroke", "black")
					       		 .attr("fill", "black")
					       		 .attr("text-anchor", "end")
					       		 .attr("dy", -90)
					       		 .attr("dx", -280)
					       		 .attr("transform", "rotate(-90)")

						  		

						  canvas.append("g")
						  		.attr("class", "x-axis")
						  		.call(xAxis)
						  		.attr("transform", "translate(0, 600)")
						  		.selectAll("text")
						  		.attr("dy", 15)



						  canvas.select(".x-axis")
				       		    .append("text")
				       		    .text("Years")
				       		    .attr("font-size", "24px")
				       		    .attr("stroke", "black")
				       		    .attr("fill", "black")
				       		    .attr("text-anchor", "end")
				       		    .attr("dy", 80)
				       		    .attr("dx", width/2)


			   var keys = canvas.append("g")
				       	  		.attr("transform", "translate(" + (width - 500) + "," + (height + 70) + ")")
				       	  		.selectAll("g")
				       	  		.data(tempLevels)
				       	  		.enter()
				       	  		.append("g")
				       	  		.attr("transform", function(d, i) {
				       	  			return "translate(" + (i * 40) + ",0)";
				       	  		})
				       	  		

				       	  	keys.append("rect")
				       	  		.attr("width", 40)
				       	  		.attr("height", 30)
				       	  		.attr("stroke", "black")
				       	  		.attr("fill", function(d) {
				       	  			return heatColor(d - 8.66)
				       	  		})
				       	  		

				       	  	keys.append("text")
				       	  	    .text(function(d) {
				       	  	    	return d.toString();
				       	  	    })
				       	  	    .attr("font-size", "14px")
				       	  	    .attr("dy", 45)
				       	  	    .attr("dx", 15)

				var tooltip = d3.select("body")
								.append("div")
								.attr("class", "tooltip")
								.style("position", "absolute")
								.style("z-index", 10)
								.style("visibility", "hidden")
								.style("background", "rgba(255,255,255,.9)")
								.style("width", "200px")
								.style("height", "80px")
								.style("border-radius", "5px")
								.style("border", "2px solid black")
								.style("padding-left", "10px")	
				       		 

		}
	})





}())