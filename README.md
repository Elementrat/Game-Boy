# Game-Boy
A Discord Boy

To get set up
* Install Node
* Open the repo
* "npm install"
* "npm install nodemon -g"
* "npm install typescript -g"

Then, to dev (with auto-compile on code-changes)
* cd into /src
* tsc --lib es6 --outDir ../build .\server.ts -w

Then, to serve (with auto-update on code changes)
* cd into /build 
* "nodemon ./server.js -w"

You'll need one more piece, the bot's secret key, DM me for that!
