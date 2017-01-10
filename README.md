#pathways-search

##Build
The following tools are required to start the build process: nodejs, and npm

Run the following commands in order to install these tools. (Source: http://blog.teamtreehouse.com/install-node-js-npm-mac)

```
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew install node
```

Follow the steps below to download and build the application

1. Download or clone repository from github into any directory
2. Run ```npm install``` in the directory in order to install all node dependencies
3. Run ```npm install webpack -g``` in order to install the webpack dependency globally
4. Run ```webpack``` in the directory to build application in development mode
5. Either open the index.html file in your web browser or host the file locally in order to run web application
