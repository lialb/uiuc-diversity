import { Component, OnInit } from "@angular/core";
import * as d3 from "d3";
import d3Tip from "d3-tip"; //d3.tip tip is not a function automatically imported with d3, d3-tip library is needed instead
import { legendColor } from "d3-svg-legend";
import * as data from "../../../assets/json/2019Summary.json";

interface margins {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  graphMargin: margins = {
    left: 200,
    right: 20,
    top: 20,
    bottom: 20,
  };
  svgWidth = 400;
  svgHeight: number;
  barRange = 900;
  piechartData: any;

  showUndergrad = true;

  constructor() {}

  ngOnInit() {
    this.initGraph();
  }

  toggleGraph(choice: boolean): void {
    this.showUndergrad = choice;
    this.initGraph();
  }

  initGraph(): void {
    const collegeArray = this.showUndergrad
      ? data["default"]["undergradTotal"]
      : data["default"]["gradTotal"];
    d3.selectAll(".once").remove();

    collegeArray.sort(
      (a: { total: number }, b: { total: number }) => b.total - a.total
    );
    const svg = d3
      .select("div#container")
      .append("svg")
      .attr("class", "once")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 1100 550")
      .classed("svg-content", true);

    //the main group where everything is drawn
    const graph = svg
      .append("g")
      .style("width", "100%")
      .attr("transform", `translate(150, 0)`);

    // x, y, color, stack are all functions
    // the length of the y-axis should be responsive to the number of majors, since the height of each bar is y.bandwidth(),
    // if there is one major with such long axis, the height of this bar can be crazily big.
    if (collegeArray.length > 20) {
      this.svgHeight = 900;
    } else if (collegeArray.length >= 8) {
      this.svgHeight = 500;
    } else if (collegeArray.length >= 4) {
      this.svgHeight = 200;
    } else if (collegeArray.length >= 2) {
      this.svgHeight = 150;
    } else {
      this.svgHeight = 80;
    }
    const y = d3
      .scaleBand() // scaleBand for categorical data
      .range([
        0,
        this.svgHeight - this.graphMargin.top - this.graphMargin.bottom,
      ]) // height of y-axis
      .domain(collegeArray.map((entry: { name: any }) => entry.name)) // domain should be an array of all the majors in this collge
      .paddingInner(0.2) // padding between each bar
      .paddingOuter(0.2) // padding to x-axis
      .align(0.1);

    const x = d3
      .scaleLinear() // scaleLinear for numerical data
      .range([0, this.barRange]) //length of bar
      .domain([0, d3.max(collegeArray, (d: { total: any }) => d.total)]); // domain of the bar chart from 0 to the biggest total in one major

    // adding y-axis and x-axis, but they are not called yet, they are just created waiting to be called
    const yAxis = d3
      .axisLeft(y) //put the text and ticks on the left of the y-axis
      .tickSize(0)
      .tickPadding(2);
    const xAxis = d3
      .axisBottom(x) //put the text and ticks on the bottom of the y-axis
      .tickSize(4)
      .ticks(1)
      .tickValues([0, d3.max(collegeArray, (d: { total: any }) => d.total)]);

    // color is a function

    const keys = Object.keys(collegeArray[0]).slice(5); //keys required to make stacked bar chart, which is each race, getting rid of keys like major
    const color = d3.scaleOrdinal(d3["schemeTableau10"]).domain(keys); //scaleOrdinal 9 colors for 9 races

    // config data
    const stack = d3.stack().keys(keys); //generate stacks
    const stackedData = stack(collegeArray); // config the data to stacked data

    // creating the stacked barcharts column by column (or color by color)
    let bargroups = graph
      .selectAll("g")
      .data(stackedData)
      .enter()
      .append("g") // adding groups vertically(column by column)
      .attr("transform", `translate(5, 0)`)
      // d can be replaced by whatever naming, it is what looping through the stackedData, so there are 9 d in total, since 9 races
      .attr("fill", (d: { key: any }) => color(d.key)); //sample d: {0: [0,286], 1: [0, 255], 2: [0, 211], ..., key: "Caucasian"}
    // get color for this race

    let rects = bargroups
      .selectAll("rect")
      .data((d: any) => d) // super tricky here, it still loops 9 times
      .enter()
      .append("rect")
      .attr("y", (d: { data: { name: any } }) => y(d.data.name)) // this d is not the same as the d above, sample: {0: 0, 1: 286, data: the actual original data before stacked}
      .attr("x", (d: any[]) => x(d[0])) // the coordinate where this rect starts
      .attr("width", (d: any[]) => x(d[1]) - x(d[0])) // the length is decided by the starting points of adjacent two rects
      .attr("height", y.bandwidth()) // height is bandwidth, remember bandwidth here is a function.
      .on(
        "mouseover",
        (d: any, i: string | number, n: { [x: string]: any }) => {
          tip.show(d, n[i]);
          svg
            .selectAll("rect")
            .filter((h: any) => h !== d) // select all other rectangles not is not the one hovered over
            .transition()
            .duration(100)
            .style("fill-opacity", 0.3); // change their opacity to highlight the emphasized one.
        }
      )
      // this.highlightLayer(d,i)})
      .on("mouseout", (d: any, i: any, n: any) => {
        tip.hide();
        d3.selectAll("rect")
          .transition()
          .duration(200)
          .style("fill-opacity", 1); // change all the colors of rectangle back
      });

    // the legend
    d3.select(".legendOnce").remove();
    const legendsvg = d3
      .select("div#legend-container")
      .append("svg")
      .attr("class", "legendOnce")
      .attr("preserveAspectRatio", "xMinYMin meet")
      .attr("viewBox", "0 0 1000 50")
      .classed("svg-content", true); // another svg on top of the main svg
    const legendGroup = legendsvg
      .append("g")
      .attr("transform", `translate(50, 0)`);
    // like x,y axis, legend is just created here, waiting to be called in a group
    const legend = legendColor()
      .shapePadding(90) //d3.legendColor() doesn't work for some reason, so had to install another dependency
      .orient("horizontal")
      .scale(color);

    legendGroup.call(legend); //call the legend
    legendGroup
      .selectAll("text") //configure the text
      .attr("fill", "black")
      .attr("font-size", 12);

    // calling xAxis, yAxis in the group
    graph
      .append("g")
      .call(yAxis)
      .selectAll("text")
      .attr("fill", "black")
      .attr("transform", "translate(-5,0)");

    graph
      .append("g")
      .attr(
        "transform",
        `translate(5, ${
          this.svgHeight - this.graphMargin.top - this.graphMargin.bottom
        })`
      )
      .call(xAxis)
      .selectAll("text")
      .attr("fill", "black")
      .attr("transform", "translate(-5,0)")
      .style("text-anchor", "end")
      .attr("transform", "rotate(-40)");

    //  tooltip
    const tip = d3Tip()
      .attr("class", "d3-tip")
      .html((d) => {
        const d2 = d[1] - d[0]; // the count of specific race in this major
        const obj = d.data; // original Object
        const half = d.data.total / 2;
        const third = (d.data.total * 2) / 3;
        let key = Object.keys(obj).find(
          (key) => obj[key] === d2 && key !== "total"
        ); // finding the race, which is the key, by value, if there is only one race in this major, total will be returned, and we don't want that.

        return ` 
                    <div style="background-color: rgba(0,0,0,0.7); padding: 8px; color: white; text-align: center; position: relative; bottom: 0.2rem" >
                      <h5 style="font-size: 1.5rem">${key}</h5>
                      <h6><strong style="font-size: 1.2rem">${d2}</strong><span style="font-size: 0.8rem"> out of </span><strong style="font-size: 1.2rem">${
          d.data.total
        }</strong><span style="font-size: 0.7rem"> students</span></h6>
                      <h6><strong style="font-size: 1.2rem">${(
                        (d2 * 100) /
                        d.data.total
                      ).toFixed(
                        2
                      )}%</strong><span style="font-size: 0.8rem"> in ${
          obj.name
        } ${obj.level}</span></h6>
                    </div>
                  `;
      });

    svg.call(tip);
  }
}
