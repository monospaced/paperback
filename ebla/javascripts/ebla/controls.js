/*
 * Ebla
 * 
 * Controls
 * 
 * Showing and hiding header (and also potentially footer)
 */
Ebla.controls = (function(){

  /*
   * Are the controls currently displayed?
   *
   * @var bool
   */
  var controlsShowing = false, 


  /*
   * 
   */
  toggle = function() {
    if (!!controlsShowing) {
      hide();
    } else {
      show();
    }
  },


  /*
   *
   */
  hide = function() {
    //debug("Ebla.controls: hiding controls");

    // hide TOC
    Ebla.toc.hide();

    // hide header 
    if (!!Ebla.compatibility.canAnimate) {
      Ebla.elements.$header
        .stop()
        .animate({opacity:0}, 250, function(){
          Ebla.elements.$header.removeClass('show');
          controlsShowing = false;
        });

      // hide footer
      Ebla.elements.$footer.stop().animate({opacity:0}, 250, function(){ 
        Ebla.elements.$footer.css({visibility:"hidden"}); 
      });

    } else {
      Ebla.elements.$header.removeClass('show');
      Ebla.elements.$footer.css({opacity:0,visibility:"hidden"});
      controlsShowing = false;
    }
  },


  /*
   *
   */
  show = function() {  
    //debug("Ebla.controls: showing controls");

    Ebla.elements.$header.addClass('show');

    if (!!Ebla.compatibility.canAnimate) {
      Ebla.elements.$header
        .stop()
        .animate({opacity:1}, 250, function(){
          controlsShowing = true;
        });
        Ebla.elements.$footer.stop().css({visibility:"visible"}).animate({opacity:1}, 250);
    } else {
      Ebla.elements.$header.css({opacity:1});
      Ebla.elements.$footer.css({opacity:1, visibility:"visible"});
      controlsShowing = true;
    }
  },



  /*
   * show/hide previous/next arrows if start/end of book
   * Checked on iframe init, and every time a page is turned
   */
  showHideNavArrows = function() {
    var $shimBack    = $(".shim-bck"),
        $shimForward = $(".shim-fwd");

    if (Ebla.book.componentIndex === Ebla.book.components.length-1 && Ebla.navigation.position - Ebla.layout.pageSize <= Ebla.layout.pageEnd) {
      $shimForward.css({display:"none"});
    } else {
      $shimForward.css({display:"block"});
    }

    if (Ebla.book.componentIndex === 0 && Ebla.navigation.position === 0) {
      $shimBack.css({display:"none"});
    } else {
      $shimBack.css({display:"block"});
    }
  };


  /*
   * Expose public methods
   */
  return {
    controlsShowing: controlsShowing,
    toggle: toggle,
    hide: hide,
    show: show,
    showHideNavArrows: showHideNavArrows
  };
}());