# pathways-search 
__This is now obsolete, ready-only repository__; the feature was improved and merged into [app-ui](/PathwayCommons/app-ui) apps.

## Setup and Installation

#### Setup
Required Tools:
* nodejs
* npm

#### Installation
Install the app dependencies using npm:

1. Download or clone repository from github into any directory
2. Run ```npm install``` in the directory in order to install all node dependencies
3. The app uses production Pathway Commons by default. If you wish to switch to beta Pathway Commons, edit the Pathway Commons URL in `./node_modules/pathway-commons/dist/private/constants.js`.
4. Build the project using one of the commands listed below.


#### npm Commands
This project uses npm as a build tool. In all applicable cases, the website is served at address 0.0.0.0 on port 8080. The following commands are available:

Note: Production builds output the result to the ```public``` folder

* ```npm run build```: build a production version of the app

* ```npm run watch```: build a development version of the app -- includes file watching, live reload. Note: This does not update the public folder with the development build

* ```npm run start```: build a production version of the app and run a ```http-server```

* ``` npm run gh-pages-deploy```: build the app and deploy it to github pages
