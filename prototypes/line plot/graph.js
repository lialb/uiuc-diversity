
const data = [{ white: 100, black: 20, asian: 200, year: '2016' },
              { white: 80, black: 50, asian: 120, year: '2017' },
              { white: 90, black: 30, asian: 120, year: '2018' },
              { white: 70, black: 50, asian: 120, year: '2019' }]

    
const graph = d3.select('svg').append('g')
                .attr('transform', 'translate(50,50)')
                .attr('width', 400)
                .attr('height', 400);

const x = d3.scaleTime().range([0, 400]).domain(d3.extent(data, d => new Date(d.year)))
const y = d3.scaleLinear().range([400, 0]).domain([0, 200]);

const line1 = d3.line()
              .x(d => x(new Date(d.year)))
              .y(d => y(d.white));

const line2 = d3.line()
              .x(d => x(new Date(d.year)))
              .y(d => y(d.black));

const line3 = d3.line()
              .x(d => x(new Date(d.year)))
              .y(d => y(d.asian));

const xAxisGroup = graph.append('g')
  .attr('class', 'x-axis')
  .attr('transform', "translate(0,400)");

const yAxisGroup = graph.append('g')
  .attr('class', 'y-axis');

const xAxis = d3.axisBottom(x).ticks(4)
const yAxis = d3.axisLeft(y).ticks(5)
xAxisGroup.call(xAxis)
yAxisGroup.call(yAxis)


const path1 = graph.append('path');
const path2 = graph.append('path');
const path3 = graph.append('path');




path3.attr('fill', 'none')
.attr('stroke', 'green')
.attr('stroke-width', 2)
.attr('d', line3(data))


const circleswhite = graph.selectAll('circle').data(data)
circleswhite.enter()
       .append('circle')
       .attr('cx', d => x(new Date(d.year)))
       .attr('cy', d => y(d.white))
       .attr('r', 5)
       .attr('fill', 'white')

path1.attr('fill', 'none')
    .attr('stroke', 'white')
    .attr('stroke-width', 2)
    .attr('d', line1(data))

circleswhite.enter()
    .append('circle')
    .attr('cx', d => x(new Date(d.year)))
    .attr('cy', d => y(d.black))
    .attr('r', 5)
    .attr('fill', 'cyan')

path2.attr('fill', 'none')
    .attr('stroke', 'cyan')
    .attr('stroke-width', 2)
    .attr('d', line2(data))

circleswhite.enter()
    .append('circle')
    .attr('cx', d => x(new Date(d.year)))
    .attr('cy', d => y(d.asian))
    .attr('r', 5)
    .attr('fill', 'green')