import { Component, OnInit, Input } from "@angular/core";
import { Color, Label } from "ng2-charts";
import { ChartDataSets, ChartOptions } from "chart.js";
import * as combinedData from "../../../assets/json/combinedSummary.json";
import * as locationData from "../../../assets/json/locationSummary.json";

@Component({
  selector: "app-line-summary",
  templateUrl: "./line-summary.component.html",
  styleUrls: ["./line-summary.component.scss"],
})
export class LineSummaryComponent implements OnInit {
  @Input() showUndergrad: boolean;
  @Input() showLocation: boolean;

  lineChartData: ChartDataSets[] = [
    { data: [], label: "Caucasian", fill: false },
    { data: [], label: "Asian American", fill: false },
    { data: [], label: "African American", fill: false },
    { data: [], label: "Hispanic", fill: false },
    { data: [], label: "Native American", fill: false },
    { data: [], label: "Hawaiian/ Pacific Isl", fill: false },
    { data: [], label: "Multiracial", fill: false },
    { data: [], label: "International", fill: false },
    { data: [], label: "Unknown", fill: false },
  ];

  lineChartOptions = {
    responsive: true,
  };

  lineChartColors: Color[] = [
    {
      borderColor: "#4e79a7",
    },
    {
      borderColor: "#f28e2c",
    },
    {
      borderColor: "#e15759",
    },
    {
      borderColor: "#76b7b2",
    },
    {
      borderColor: "#59a14f",
    },
    {
      borderColor: "#edc949",
    },
    {
      borderColor: "#af7aa1",
    },
    {
      borderColor: "#ff9da7",
    },
    {
      borderColor: "#9c755f",
    },
    {
      borderColor: "#bab0ab",
    },
  ];
  lineChartLabels = [];
  lineChartLegend = true;
  lineChartPlugins = [];
  lineChartType = "line";

  lineChoice = "KV"; // Default is LAS

  // lineColors = [ccebc5ffed6f];
  collegeName = "Liberal Arts and Sciences";

  constructor() {}

  ngOnInit() {
    if (this.showLocation) {
      this.lineChartData = [
        { data: [], label: "In State", fill: false },
        { data: [], label: "Out of State", fill: false },
        { data: [], label: "International", fill: false },
      ];
    }
    for (let i = 2004; i <= 2019; ++i) {
      this.lineChartLabels.push(i);
    }
    console.log(this.lineChartData);
    this.initLineChart();
  }

  initLineChart(): void {
    if (!this.showLocation) {
      let labels = [
        "Caucasian",
        "Asian American",
        "African American",
        "Hispanic",
        "Native American",
        "Hawaiian/ Pacific Isl",
        "Multiracial",
        "International",
        "Unknown",
      ];
      if (this.showUndergrad) {
        for (let i = 0; i < labels.length; ++i) {
          this.lineChartData[i]["data"] =
            combinedData["default"][this.lineChoice]["undergradTotal"][i][
              "data"
            ];
        }
      } else {
        for (let i = 0; i < labels.length; ++i) {
          this.lineChartData[i]["data"] =
            combinedData["default"][this.lineChoice]["gradTotal"][i]["data"];
        }
      }
    } else {
      let labels = ["In State", "Out of State", "International"];
      if (this.showUndergrad) {
        for (let i = 0; i < labels.length; ++i) {
          this.lineChartData[i]["data"] =
            locationData["default"][this.lineChoice]["undergradTotal"][i][
              "data"
            ];
        }
      } else {
        for (let i = 0; i < labels.length; ++i) {
          this.lineChartData[i]["data"] =
            locationData["default"][this.lineChoice]["gradTotal"][i]["data"];
        }
      }
    }
  }

  chooseLineGraph(choice: string, name: string): void {
    this.lineChoice = choice;
    this.collegeName = name;
    this.initLineChart();
  }
}
