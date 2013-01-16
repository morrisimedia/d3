var w = 925,
	h = 550,
	margin = 30,
	minY = 0,
	maxY = 20,
	format=d3.time.format("%Y%m%d"),
	format2=d3.time.format("%Y-%m-%d"),
	startDate=format.parse("20121217")
	endDate=format.parse("20130114")
	y = d3.scale.linear().domain([maxY, minY]).range([0 + margin, h - margin]),
	x = d3.scale.linear().domain([startDate,endDate]).range([0 + margin -5, w]),
	dates = d3.range(startDate, endDate);
	
//Set up initial svg
var vis = d3.select("#vis")
    .append("svg:svg")
    .attr("width", w)
    .attr("height", h)
    .append("svg:g");
			
			
//Write an individual curve
var line = d3.svg.line()
    .x(function(d,i) { return x(d.x); })
    .y(function(d) { return y(d.y); });
					

var startEnd = {},
    countryCodes = {};
d3.text('nn_pvsv_lift vs marketer.csv', 'text/csv', function(text) {
    var countries = d3.csv.parseRows(text);
	var rawdates = countries[0].slice(1,countries[0].length) //get dates from first row of csv
	var dates=[]
    
	//go through each row
    for (i=1; i < countries.length; i++) {
        var values = countries[i].slice(1, countries[i].length);
        var currData = [];
        countryCodes[countries[i][0]] = countries[i][0]; //countryCodes?

        var started = false;
        for (j=0; j < values.length; j++) {
			dates[j] = format.parse(rawdates[j])
            if (values[j] != '') {
                currData.push({ x: dates[j], y: values[j] });
                if (!started) {
                    startEnd[countries[i][0]] = { 'startDate':dates[j], 'startVal':values[j] };
                    started = true;
                } else if (j == values.length-1) {
                    startEnd[countries[i][0]]['endDate'] = dates[j];
                    startEnd[countries[i][0]]['endVal'] = values[j];
                }
            }
        }

        
        // Actual line
        vis.append("svg:path")
            .data([currData])
            .attr("country", countries[i][0])
            .attr("d", line)
            .on("mouseover", onmouseover)
            .on("mouseout", onmouseout);
    }
});  
    
vis.append("svg:line")
    .attr("x1", x(startDate))
    .attr("y1", y(minY))
    .attr("x2", x(endDate))
    .attr("y2", y(minY))
    .attr("class", "axis")

vis.append("svg:line")
    .attr("x1", x(startDate))
    .attr("y1", y(minY))
    .attr("x2", x(startDate))
    .attr("y2", y(maxY))
    .attr("class", "axis")
			
vis.selectAll(".xLabel")
    .data(x.ticks(5))
    .enter().append("svg:text")
    .attr("class", "xLabel")
    .text(["test1", "tests2"])
    .attr("x", function(d) { return x(d) })
    .attr("y", h-10)
    .attr("text-anchor", "middle")

vis.selectAll(".yLabel")
    .data(y.ticks(4))
    .enter().append("svg:text")
    .attr("class", "yLabel")
    .text(String)
	.attr("x", 0)
	.attr("y", function(d) { return y(d) })
	.attr("text-anchor", "right")
	.attr("dy", 3)
			
vis.selectAll(".xTicks")
    .data(x.ticks(5))
    .enter().append("svg:line")
    .attr("class", "xTicks")
    .attr("x1", function(d) { return x(d); })
    .attr("y1", y(minY))
    .attr("x2", function(d) { return x(d); })
    .attr("y2", y(minY)+7)
	
vis.selectAll(".yTicks")
    .data(y.ticks(4))
    .enter().append("svg:line")
    .attr("class", "yTicks")
    .attr("y1", function(d) { return y(d); })
    .attr("x1", x(startDate-0.5))
    .attr("y2", function(d) { return y(d); })
    .attr("x2", x(startDate))

function onclick(d, i) {
    var currClass = d3.select(this).attr("class");
    if (d3.select(this).classed('selected')) {
        d3.select(this).attr("class", currClass.substring(0, currClass.length-9));
    } else {
        d3.select(this).classed('selected', true);
    }
}

function onmouseover(d, i) {
    var currClass = d3.select(this).attr("class");
    d3.select(this)
        .attr("class", currClass + " current");
    
    var countryCode = $(this).attr("country");
    
    var blurb = '<h2>' + countryCode + '</h2>';
    
    $("#default-blurb").hide();
    $("#blurb-content").html(blurb);
}
function onmouseout(d, i) {
    var currClass = d3.select(this).attr("class");
    var prevClass = currClass.substring(0, currClass.length-8);
    d3.select(this)
        .attr("class", prevClass);
    $("#default-blurb").show();
    $("#blurb-content").html('');
}

/*
function showRegion(regionCode) {
    var countries = d3.selectAll("path."+regionCode);
    if (countries.classed('highlight')) {
        countries.attr("class", regionCode);
    } else {
        countries.classed('highlight', true);
    }
}
*/

$(document).ready(function() {
    $('#filters a').click(function() {
        var countryId = $(this).attr("id");
        $(this).toggleClass(countryId);
        showRegion(countryId);
    });
    
});
