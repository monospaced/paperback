/*
 * Ebla
 *
 * compatibility
 *
 * Test for browser support
 */
Ebla.compatibility = (function() {

  /*
   * compatibility chart
   *
   * (this is returned)
   *
   * @var obj
   */
  var compat = {
    clickEvent: null,
    keyEvent: null,

    // browsers/devices
    isIe: false,
    isIeOld: false,
    isIe8: false,
    isIe7: false,
    isIe6: false,
    isKindle: false,
    isAndroid: false,
    isMobileSafari: false,
    isMobile: false,

    // capabilites/bugs
    hasCssAnimations: false,
    hasCssColumns: false,
    hasCssHyphens: false,
    hasLocalStorage: false,
    canAnimate: true,
    canOpenBrowserWindows:true,
    needsDoubleWidthFix: false,
    hasIframeDimensionsBug: false,
    hasNoScrollEventBug: false
  },


  /*
   * detect interwebz explora
   */
  ie = function() {

    // detect IE version
    // using jQuery as conditional commenting detection will be stripped out by minification script
    compat.isIe = $.browser.msie || false;

    // know thine enemy
    if (compat.isIe) {
      compat.isIeOld = parseInt($.browser.version, 10) < 9;
      if (compat.isIeOld) {
        compat.isIe8 = compat.isIe.version === 8;
        compat.isIe7 = compat.isIe.version === 7;
        compat.isIe6 = compat.isIe.version === 6;
      }
    }
  },


  /*
   * detect specific devices
   */
  detectDevices = function(){
    // detect Kindle
    compat.isKindle = !!navigator.userAgent.match(/Kindle/);

    // detect android
    compat.isAndroid = !!(navigator.userAgent.match(/Android/) || navigator.userAgent.match(/Silk/));

    // detect mobile safari
    compat.isMobileSafari = !!navigator.userAgent.match(/AppleWebKit.*Mobile/);

    // set whether we're on a mobile browser (for showing/hiding footer)
    compat.isMobile = (Modernizr.mq('only all and (max-device-width: 480px)'));
  },


  /*
   * fix any devices that may have been detected
   */
  fixDevices = function() {

    // fixKindle
    if (compat.isKindle) {
      compat.hasLocalStorage = false;
      compat.keyEvent = "keyup";
      compat.needsDoubleWidthFix = true;
      compat.canOpenBrowserWindows = false;
      compat.hasNoScrollEventBug = true;
    }

    //fixAndroid
    if (compat.isAndroid) {
      compat.needsDoubleWidthFix = true;
      compat.hasIframeDimensionsBug = true;
    }
  },



  /*
   * Initialisation function
   * Run this automatically
   *
   */
  init = (function() {

    // compatibility tests
    compat.hasCssColumns = Modernizr.csscolumns;
    compat.hasCssAnimations = Modernizr.cssanimations;
    compat.hasCssHyphens = Modernizr.testAllProps('hyphens');
    compat.clickEvent = Modernizr.touch ? 'touchend' : 'mousedown';
    compat.hasLocalStorage = Modernizr.localstorage;
    compat.keyEvent = 'keydown';

    ie();
    detectDevices();
    fixDevices();
  }());



  /*
   * Expose public methods
   */
  return compat;
}());