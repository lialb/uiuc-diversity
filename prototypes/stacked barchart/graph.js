const svg = d3.select('svg')
const margin = {top: 20, right: 20, bottom: 30, left: 40};
const graph = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");



var y = d3.scaleBand()			// x = d3.scaleBand()	
    .range([0, 100])	// .rangeRound([0, width])
    .paddingInner(0.05)
    .align(0.1);

var x = d3.scaleLinear()		// y = d3.scaleLinear()
    .rangeRound([0, 900]);	// .rangeRound([height, 0]);

var z = d3.scaleOrdinal()
    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);


var yAxis = d3.axisLeft(y)
    .tickSize(0)
    .tickPadding(6);

var tip = d3.tip()
            .html(function (d) {
                let content = `<div class="name">${d.data.major}</div>`;
               return content;
            });

const highlightLayer = (d, i, n) => {
    tip.show(d,n[i])
}
const hideIt = () => {
    tip.hide()
}

d3.csv("./data.csv").then(data => {
  console.log(data)
  const keys = data.columns.slice(1);
  y.domain(data.map(entry => entry.major));
  x.domain([0, 200]);
  z.domain(keys)
  const stack = d3.stack().keys(keys);
  const stackedData = stack(data)
//   console.log(stackedData)
  graph.call(tip)
  let bargroups = graph.selectAll("g").data(stackedData)
                         .enter()
                        .append("g")
                        .attr("fill", d => {
                            // console.log(d)
                            return z(d.key)})

  let rects = bargroups.selectAll('rect')
                       .data(d => d)
                       .enter().append("rect")
                       .attr("y", function(d) { return y(d.data.major); })	    
                       .attr("x", function(d) { return x(d[0]); })			 
                       .attr("width", function(d) { return x(d[1]) - x(d[0]); })
                       .attr("height", 20)
                       .on("mouseenter", (d, i, n) => highlightLayer(d, i, n))
                       .on("mouseout", hideIt)
   graph.append('g').call(yAxis).selectAll('text').attr('fill', 'white').attr('transform', 'translate(0,-5)')
})

