# pathways-search

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

* ```npm run build``` to do a production build of the application and output the result to the public folder.

* ```npm run watch``` to do a development build of the application using auto file watch and browser reloading. Note: This does not update the public folder with the development build.

* ```npm run start``` to do a production build of the application, output result to the public folder, and serve using http-server.
