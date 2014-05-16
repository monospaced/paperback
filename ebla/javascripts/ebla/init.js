/*
 * Ebla
 * 
 * Init
 *
 * Controls main Ebla functionality
 * called when page and/or new iframe content is loaded
 */
Ebla.init = {

  /*
   *
   * 
   * @var 
   */
  inited : false,

  /*
   *
   *
   * @var
   */
  domLoaded : false,

  /*
   *
   *
   * @var
   */
  windowLoaded : false,

  /*
   *
   *
   * @var
   */
  sandboxLoaded : false,


  /*
   * Initialisation function
   * Run this automatically
   * 
   */
  _init : (function() {
    $(document).ready(function(){
      Ebla.elements.domLoad(); 
      Ebla.resize.domLoad();
      Ebla.book.domLoad(); 
      Ebla.images.domLoad(); 
      Ebla.flashMessage.domLoad();
      Ebla.toc.domLoad();
      Ebla.loader.domLoad();
      Ebla.init.domLoad();
      
      // can't do this as they must be initialised in a specific order
      //for (component in Ebla) {
      //  if (!!Ebla[component].domLoad) {
      //    Ebla[component].domLoad();
      //  }
      //}
    });
  }()),


  /*
   *
   */
  domLoad : function() {

    Ebla.elements.sandbox.setAttribute('scrolling','no'); /* if set in html, chrome won't display scrollbars (non-js) */

    Ebla.elements.$window.bind('load', function(){
      Ebla.init.windowLoad();
    });

    $("#sandbox").bind('load', function(){
      Ebla.init.sandboxLoad();
    });

      // set whether to show animations, based on user agent
    if (!Ebla.compatibility.canAnimate) {
      Ebla.elements.$body.addClass('no-animation');
    }

    Ebla.init.domLoaded = true;

    debug("Ebla.init: DOM has loaded");
  },


  /*
   *
   */
  windowLoad : function() {
    debug("Ebla.init: window loaded");

    if (Ebla.book.dataLoaded) {
      Ebla.init.init();
      Ebla.init.inited = true;
      Ebla.placesaver.restore();
    }
    
    Ebla.init.windowLoaded = true;
  },


  /*
   *
   */
  sandboxLoad : function() {
    debug("Ebla.init: sandbox loaded");

    // need to init every time a new frame is loaded
    if (Ebla.init.windowLoaded && Ebla.book.dataLoaded) {
      Ebla.init.init(true);
      Ebla.init.inited = true;
    }

    Ebla.init.sandboxLoaded = true;
  },


  /* 
   * initialise component
   * functionality that needs to occur every time the frame is reloaded
   * isIframeLoad: differentiate between a full page load and an iframe load
   */    
  init : function(isIframeLoad) {

    // store new component ID
    Ebla.book.component = Ebla.elements.sandbox.getAttribute('src').replace(Ebla.book.metaData.location, "").split("#")[0];
    
    
    // condition : if no component is loaded initially, set to the first available
    if (!Ebla.book.component) {
      debug("Ebla.init: setting first component");
      Ebla.elements.sandbox.setAttribute('src', Ebla.book.metaData.location + Ebla.book.components[0]);

      // only just loading the iframe now, 
      // so wait until it has loaded before continuing
      // (this method will be called again when it arrives)
      return;
    }
    
    Ebla.book.componentIndex = $.inArray(Ebla.book.component,Ebla.book.components);
    if (Ebla.book.componentIndex === -1) { Ebla.book.componentIndex = 0; }
    debug("Ebla.init: Component " + Ebla.book.componentIndex + " has just loaded ("+Ebla.book.component+")");
    
    // create the TOC if it doesn't already exist
    Ebla.toc.createToc();

    // store new iframe element
    Ebla.elements.frame = window.frames.sandbox.document.getElementsByTagName('body')[0];
    Ebla.elements.$frame = $(Ebla.elements.frame);
    var $frameDoc = $(window.frames.sandbox.document);

    // js enabled on component, id used for css styling
    Ebla.elements.frame.setAttribute('id','ebla-js');

    // Hyphenate
    Ebla.layout.hyphenation(Ebla.elements.frame);

    // dimensions
    Ebla.layout.calculateDimensions(true);

    // show/hide forward/back arrows at start/end of book
    Ebla.controls.showHideNavArrows();

    // listen for links and key events in the new iframe
    $frameDoc.bind(Ebla.compatibility.clickEvent, function(e){
      Ebla.navigation.event.handleClick(e, true);
    });
    $frameDoc.bind(Ebla.compatibility.keyEvent,function(e){
      Ebla.navigation.keyboard.handleKeyDown(e);
      debug("Ebla.navigation.keyboard: key press on iframe");
    });

    // re-bind key events on the window
    Ebla.elements.$document.unbind(Ebla.compatibility.keyEvent);
    Ebla.elements.$document.bind(Ebla.compatibility.keyEvent, function(e){
      Ebla.navigation.keyboard.handleKeyDown(e);
      debug("Ebla.navigation.keyboard: key press on window");
    });

    // as we're binding to 'mousedown' we also need to 
    // prevent 'click' from firing its default behaviour 
    $frameDoc.bind('click', function(e){
      e.preventDefault();
    });

    // store touch event starting points, wiped out when touchend is triggered
    if (Modernizr.touch) {
      $frameDoc.bind("touchstart", function(e){
        Ebla.navigation.event.storeTouchStart(e, true);
      });
      $frameDoc.bind("touchmove", function(e){
        Ebla.navigation.event.storeTouchMove(e, true);
      });
    }

    // fix issue when scrolling iframe content without using the built-in system
    Ebla.navigation.fixInnerScroll();

    debug("Ebla.init: " + (isIframeLoad ? "Component " + Ebla.book.componentIndex : "Ebla")+" init complete");
  }
};