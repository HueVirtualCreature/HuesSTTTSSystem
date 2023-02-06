Lots of changes:
* broke all the javascript into smaller files
* avoided global scope by having accessors for state
* removed a polyfill
* removed any code that didn't seem to be used
* Added local RTC option
  * Lets rtc control panel interface with it.
* Added SAMMI extension
  * uses the RTC connection to send signals to the app.