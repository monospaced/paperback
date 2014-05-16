/*
 * Ebla
 * 
 * Images
 * 
 * { preload images, etc }
 */
Ebla.images = (function() {

  /*
   * Initial preload image functionality
   * 
   * @var 
   */
  var preloadArray = [
    { src: (Ebla.compatibility.hasCssAnimations ? "images/loader.png" : "images/loader.gif"), callback: function(){  
        $('#loader-icon').css('display','block');
      }
    },
    { src: "images/icons.png"}
  ],


  /*
   * Has the dom loaded?
   * 
   * Load the image immediately, or store it for dom load
   */
  domHasLoaded = false,


  /*
   * Preload image - public method
   * 
   */
  preload = function(src, callback) {
    var img = {};
    img.src = src;
    if (callback) {
      img.callback = callback;
    }
    
    // preload immediately, or wait until dom load?
    if (!domHasLoaded) {
      preloadArray.push(img);
    } else {
      _preload(img);
    }
  },


  /*
   * Actually preload an image - abstracted to allow wait for dom load
   */
  _preload = function(img) {
    var preloader = new Image();
    preloader.src = img.src;
    debug("Ebla.images: preloading " + img.src);
    if (!!img.callback) {
      $(preloader).bind('load', function(e) {
        img.callback();
      });
    }
  },


  /*
   * Method to call on Dom load
   */
  domLoad = function() {
    while (preloadArray.length) {
      _preload(preloadArray.pop());
    }
    domHasLoaded = true;
  },


  /*
   * Initialisation function
   * Run this automatically
   * 
   */
  init = (function() {
   //   
  }());


  /*
   * Expose public methods
   */
  return {
    preload:preload,
    domLoad:domLoad
  };
}());