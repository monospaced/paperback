/*
 * Ebla
 * 
 * Debug
 * 
 * Post debug messages (if debug mode is activated)
 * (N.B. activate debug mode by adding 'debug' to the URL)
 */
Ebla.debug = (function(){

  /*
   * is debug mode on?
   * 
   * @var bool
   */
  var debugMode = false,


  /* 
   * debug mode information box
   * show and hide a debug message (if debug mode is on)
   * (auto-hide debug box after a timeout interval by default)
   * @var message {string} The message to add to the debug box (if debugMode is on)
     */
  debug = function(message) {
    if (!Ebla.debug.debugMode) { return; }
    if (!Ebla.flashMessage) { return; }
    Ebla.flashMessage.post(message);
  },


  /*
   * Initialisation function
   * Run this automatically
   * 
   */
  init = (function() {
    if (window.location.href.match(/debug/)) {
      debugMode = true;
    }

    // make debug available globally
    // quicker than writing Ebla.debug.debug
    if (!window.debug) {
      window.debug = debug;
    }
  }());


  /*
   * Expose public methods
   */
  return {
    debugMode: debugMode,
    debug: debug
  };
}());
