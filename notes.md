Lots of changes:
* broke all the javascript into smaller files
* avoided global scope by having accessors for state
* removed a polyfill
* removed any code that didn't seem to be used
* Added local Websocket option
  * Lets websockets interface with the site.
* Added SAMMI extension
  * uses the websocket connection to send signals to the app.
  * Needs to run a small server (./sammi-extension/node.js) to host files, host api, and run a websocket server
  * 