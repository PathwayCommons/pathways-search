#pathways-search

##Build
The following tools are required to start the build process: nodejs, and npm

For OSX, run the following commands in order to install these tools. (Source: http://blog.teamtreehouse.com/install-node-js-npm-mac)

```
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew install node
```

Follow the steps below to download and install application

1. Download or clone repository from github into any directory
2. Run ```npm install``` in the directory in order to install all node dependencies

This project uses npm as a build tool. In all applicable cases, the website is served at address 0.0.0.0 on port 8080. The following commands are available:

#####build
Run ```npm run build``` to do a production build of the application and output the result to the public folder.

#####watch
Run ```npm run watch``` to do a development build of the application using auto file watch and browser reloading. Note: This does not update the public folder with the development build.

#####start
Run ```npm run start``` to do a production build of the application, output result to the public folder, and serve using http-server.
