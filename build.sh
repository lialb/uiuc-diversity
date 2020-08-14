#!/bin/bash
cd client
ng build --prod --output-path ../docs --base-href /uiuc-diversity/
cd ../docs
cp index.html 404.html

