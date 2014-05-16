/*
 * Ebla
 * 
 * Click/touch events
 * 
 */
Ebla.navigation.event = {

  /*
   * Store the position object of the last touch event
   * 
   * @var 
   */
  lastTouchEvent : null,

  /*
   * Was the last touch event a move event?
   * 
   * @var bool
   */
  lastTouchEventWasMove : null,


  /*
   * Initialisation function
   * Run this automatically
   * 
   */
  init : (function() {

    /* 
     * click event navigation
     * listen for clicks on the main page body
     * listener for the iframe set on load
    */
    Ebla.elements.$document.bind(Ebla.compatibility.clickEvent, function(e){
      Ebla.navigation.event.handleClick(e);
    });

    // store touch event starting points, wiped out when touchend is triggered
    if (Modernizr.touch) {
      Ebla.elements.$document.bind("touchstart", function(e){
        Ebla.navigation.event.storeTouchStart(e);
      });
      Ebla.elements.$document.bind("touchmove", function(e){
        Ebla.navigation.event.storeTouchMove(e);
      });
    }
  }()),



  /*
   *
   */
  handleClick : function(e, fromFrame) {

    if (!!Ebla.loader.loading) { return; } 

    // find the target element - may be the parent
    var targetNode = e.target;

    if (!!Ebla.toc.tocStatus()) { 
      if ($(targetNode).hasClass('overlay-shim-show')) {
        Ebla.toc.hide();
      }
      return; 
    }

    if (e.target.nodeName !== "A") {
      targetNode = $(e.target).closest("a")[0];
    } 

    // condition : if a link has been clicked, check what to do
    if (targetNode && targetNode.nodeName === "A") {

      var target = $(targetNode).attr('href'),
          component, hash;

      // condition : internal link from iframe?
      // update the iframe hash
      if (fromFrame && !target.match(/http/)) {

        // separate any hash values from component - need to deal with separately
        hash = target.split("#")[1];
        component = target.split("#")[0];

        // route through internal system 
        e.preventDefault();
        if (!Ebla.compatibility.isIeOld && !!e.stopPropagation) {
          e.stopPropagation();
        }
        Ebla.navigation.updateComponent(component, null, hash);


      // external link from iframe
      // open new window
      } else if (fromFrame) {
        if (Ebla.compatibility.canOpenBrowserWindows) {
          e.preventDefault();
          window.open(target);

        // for devices that can't open multiple browser windows, need to open link in this window (replace ebla)
        } else {
          window.location.href = target;
        }

      // JS header link - TOC etc
      // JS is dealt with elsewhere, so just stop link
      } else if (!fromFrame && target.charAt(0) === "#") {
        e.preventDefault();
      } 


      // link dealt with
      return;

    // not a link, stop event propagation
    } else {
      e.preventDefault();
    }


    // IF we have got this far, it wasn't a link, so detect click location and proceed
    

    // detect the position of the click from the touch event / mouse click event
    var eventType = (e.originalEvent.touches) ? this.lastTouchEvent : e,
      x = eventType.pageX, 
      targetX;


    // condition : if the frame
    if (fromFrame) {
      x += Ebla.elements.sandbox.offsetLeft;
    }

          
    // calculate what to do based on where the user has clicked
    targetX = x/Ebla.elements.container.offsetWidth;
    if (targetX > 0.33 && targetX < 0.67 && !this.lastTouchEventWasMove) {
      Ebla.controls.toggle();
    } else if (!Ebla.toc.tocStatus() && (targetX <= 0.33 || (targetX < 0.45 && this.lastTouchEventWasMove))) {
      Ebla.navigation.turnPage('backwards');
    } else if (!Ebla.toc.tocStatus() && (targetX >= 0.67 || (targetX > 0.55 && this.lastTouchEventWasMove))) {
      Ebla.navigation.turnPage('forward');
    }
    
    debug("Ebla.navigation.event: Detected click from " + (fromFrame ? "frame" : "window") + " at " + Math.round(targetX*100) + "%");
  },


  /*
   * Store touch events, ready for the end to be triggered
   * (The end sometimes wipes the touch events before you can use them)
   */
  storeTouchStart : function(e, fromiFrame) {
    this.lastTouchEvent = e.originalEvent.touches[0];
    this.lastTouchEventWasMove = false;
    //debug("Ebla.navigation.event: Touch start: " + e.originalEvent.touches[0].pageX);
  },


  /*
   *
   */
  storeTouchMove : function(e, fromiFrame) {
    this.lastTouchEvent = e.originalEvent.touches[0];
    this.lastTouchEventWasMove = true;
    //debug("Ebla.navigation.event: Touch move: " + e.originalEvent.touches[0].pageX);
  }
};