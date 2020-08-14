# UIUC Diversity Visualization

Currently hosted at: [lialbert.com/uiuc-diversity](https://lialbert.com/uiuc-diversity)

## About

Looking around your classroom, you may notice patterns of your classmates in each course you take. Is this a coincidence?

The University of Illinois at Urbana-Champaign has one of the most diverse collegiate student bodies in the world. However, while some majors have a wide array of demographics, other programs are more concentrated in racial disparities. This tool aims to provide information on the raw data, context for historical norms and racial norms, and progression of diversity within fields. We seek to encourage discussion on racial inequality in higher education and in the professional workplace setting.

This website shows the demographics of **every major at UIUC**, along with each major's history for the last 15 years. Race is a construct, and we hope this tool can provide context to the history of our University and Higher Education in general.

All data is public and comes from the [Division of Management Information](http://dmi.illinois.edu/index.htm). The raw spreadsheets from 2004 to 2019 are located in `./data/rawData`. We clean the data by removing some headers, and convert the spreadsheets into CSV format. Finally, we run our `main.py` python script to extract all the data into accessible JSON used by our frontend. 

## Building and Deploying

The frontend is built with Angular and is located in the `client` directory. This website is currently hosted on Github Pages. To deploy, run `./build.sh` in the root directory. 
