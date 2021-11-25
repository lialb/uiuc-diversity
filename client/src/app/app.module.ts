import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { ChartsModule } from "ng2-charts";

import { AppComponent } from "./app.component";
import { AboutComponent } from "./pages/about/about.component";
import { SidebarComponent } from "./components/sidebar/sidebar.component";
import { HomeComponent } from "./pages/home/home.component";
import { CollegeComponent } from "./pages/college/college.component";
import { PiechartComponent } from "./components/piechart/piechart.component";
import { NavbarComponent } from "./components/navbar/navbar.component";
import { LineSummaryComponent } from "./components/line-summary/line-summary.component";
import { LineCollegeComponent } from "./components/line-college/line-college.component";

const routes: Routes = [
  { path: "", component: HomeComponent },
  { path: "about", component: AboutComponent },
  { path: "college/:college/:level", component: CollegeComponent },
  { path: "**", redirectTo: "" },
];

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    SidebarComponent,
    HomeComponent,
    CollegeComponent,
    PiechartComponent,
    NavbarComponent,
    LineSummaryComponent,
    LineCollegeComponent,
  ],
  imports: [BrowserModule, RouterModule.forRoot(routes), ChartsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
