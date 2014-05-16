/*
 * Ebla
 * 
 * Resize
 * 
 * What to do when the page resizes
 */
Ebla.resize = (function(){

  /*
   *
   * 
   * @var 
   */
  var resizeTimer = null, 

  /*
   * store the existing window width/height...
   * If these values change after a resize, allow a resize event
   * 
   * @var obj
   */
  currentDimensions = {
    width:0,
    height:0
  },


  /*
   * Initialisation function
   * Run this automatically
   * 
   */
  init = (function() {
    Ebla.elements.$window.bind('resize',function(){
      resized();
    });
    Ebla.elements.$window.bind('orientationchange', function(){
      rotated();
    });
  }()),


  /*
   * save the window dimensions on load
   */
  domLoad = function() {
    currentDimensions = cacheDimensions();
  },


  /*
   * store the window dimensions, to catch false resize events 
   */
  cacheDimensions = function() {
    return {
      width: Ebla.elements.$window.width(),
      height: Ebla.elements.$window.height()
    };
  },


  /*
   * return the current window dimensions
   */
  getCurrentDimensions = function() {
    return currentDimensions;
  },


  /*
   * test whether the supplied dimensions equal the current dimensions
   */
  testDimensions = function(obj) {
    return obj.width === Ebla.elements.$window.width() && obj.height === Ebla.elements.$window.height();
  },


  /*
   * Resize event
   */
  resized = function() {

    // condition : don't automatically trigger a resize if TOC is showing
    // (this could also happen on devices that can rotate, dealt with separately)
    if(Ebla.toc.tocStatus()) {
      return;
    }

    // check if dimensions have changed
    // avoid false-positive resize events
    if (testDimensions(currentDimensions)) {
      return;

    // dimensions have changed, store new dimensions for future tests
    // and carry on firing resize event
    } else {
      currentDimensions = cacheDimensions();
    }


    Ebla.loader.show();

    // debounce, hopefully will only fire once
    // solves issue with some browsers/devices firing multiple resize events
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(
      function () {

        // if the iframe won't resize correctly, 
        // force a reload
        if (Ebla.compatibility.hasIframeDimensionsBug && window.orientation !== 0) {
          window.location.reload();

        // 
        } else {

          debug("Ebla.resize: Resize debounced");

          Ebla.layout.calculateDimensions();

          // restore previous position, 
          // based on percentage through
          Ebla.placesaver.restore();
        }
      },
      500
    );
    
    debug("Ebla.resize: Resize detected");
  },



  /*
   * Rotate event
   */
  rotated = function() {
    // if the TOC is showing,
    // Prepare a resize event when TOC disappears
    if(Ebla.toc.tocStatus()) {
      debug("Ebla.resize: Prepare resize when TOC disappears");
      Ebla.toc.fireResizeOnHide();
    }

    debug("Ebla.resize: Rotated");
  };


  return {
    domLoad: domLoad,
    cacheDimensions: cacheDimensions,
    getCurrentDimensions: getCurrentDimensions,
    testDimensions: testDimensions,
    resized: resized,
    rotated: rotated
  };
}());