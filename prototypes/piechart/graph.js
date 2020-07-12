const svg = d3.select('.canvas')
              .append('svg')
              .attr('width', 500)
              .attr('height', 500)
              
const graph = svg.append('g').attr('transform', 'translate(300,300)')



const selected = document.querySelector('#major-select')
// const cs =[{race: 'asian', amount: 300},
//            {race:'white', amount: 270},
//            {race: 'black', amount: 30},
//            {race: 'native', amount: 50}]

// const compe =[{race: 'asian', amount: 280},
//            {race:'white', amount: 280},
//            {race: 'black', amount: 50},
//            {race: 'native', amount: 80}]
const data = {
            cs: [{race: 'asian', amount: 300},
                 {race:'white', amount: 270},
                 {race: 'black', amount: 30},
                 {race: 'native', amount: 50}],
            compe: [{race: 'asian', amount: 280},
                    {race:'white', amount: 280},
                    {race: 'black', amount: 50},
                    {race: 'native', amount: 80}]}

const pie = d3.pie().sort(null).value(d => d.amount)
const arcPath = d3.arc().innerRadius(75).outerRadius(150)
const color = d3.scaleOrdinal(d3['schemeSet3']).domain(data[selected.value].map(entry => entry.race))
const legendGroup = svg.append('g')
  .attr('transform', 'translate(440, 10)')

const legend = d3.legendColor()
  .shape('circle')
  .shapePadding(10)
  .scale(color);

const tip = d3.tip()
  .attr('class', 'tipcard')
  .html(d => {
    let content = `<div class="name">${d.data.race}</div>
                   <div class="cost">${d.data.amount}</div>`;
    return content;
  });
graph.call(tip);
legendGroup.call(legend);
legendGroup.selectAll('text').attr('fill', 'white');

const paths = graph.selectAll('path').data(pie(data[selected.value]))

paths.enter()
     .append('path')
     .attr('d', arcPath)
     .attr('fill', d => color(d.data.race))
     .attr('stroke', 'white')
     .attr('stroke-width', 3)



graph.selectAll('path')
.on('mouseover', (d, i, n) => {
  d3.select(n[i])
    .transition().duration(300)
      .attr('fill', 'white')
  tip.show(d,n[i])
})
.on('mouseout', (d, i, n) => {
  d3.select(n[i])
    .transition().duration(300)
    .attr('fill', d => color(d.data.race))
  tip.hide()
})




