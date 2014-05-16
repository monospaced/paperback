/*
 * Ebla
 *
 * Table of Contents
 *
 * Control the TOC
 */
Ebla.toc = (function() {

  /*
   *
   *
   * @var
   */
  var $tocTrigger,

  /*
   *
   *
   * @var
   */
  $toc,

  /*
   *
   *
   * @var
   */
  $tocShim,

  /*
   *
   *
   * @var
   */
  $tocClose,

  /*
   *
   *
   * @var
   */
  $tocLinks,

  /*
   *
   *
   * @var
   */
  tocShowing = false,

  /*
   *
   *
   * @var
   */
  creatingToc = false,


  /*
   * Fire resize?
   *
   * If the toc is showing during a browser resize
   * we delay the resize event until after the toc is hidden again
   *
   * @var bool
   */
  fireResize = false,

  /*
   * suppress resize?
   * takes priority over fireResize
   * e.g. if someone clicks a link in the TOC, don't resize as it'll change to the current component
   */
  suppressResize = false,

  /*
   * At the point when the TOC is displayed, store the existing
   * window width/height...
   * If these values change while the TOC is displayed, trigger a resize
   * when the TOC disappears
   *
   * @var obj
   */
  preTocDimensions = {
    width:0,
    height:0
  },

  /*
   *
   */
  domLoad = function() {

    // find all toc link triggers
    $tocTrigger = $("a.toc");
    $toc = $(".nav");


    // create TOC
    $tocShim = $("<div />")
      .addClass("overlay-shim")
      .appendTo(Ebla.elements.$container);

    $toc.appendTo($tocShim);

    $tocClose = $("<a />")
      .attr("href", "#")
      .addClass("nav-close icon")
      .text("close")
      .appendTo($toc);

    // bind toc events
    $tocTrigger.bind(Ebla.compatibility.clickEvent, function(e){
      toggle();
    });
    $tocClose.bind(Ebla.compatibility.clickEvent, function(e){
      hide();
    });

    // prevent click defaults
    $tocTrigger.bind('click', function(e){
      e.preventDefault();
    });
    $tocClose.bind('click', function(e){
      e.preventDefault();
    });


    // check to see if the TOC isn't already pre-populated
    if ($toc.find("ol").length > 0) {
      initTocLinks();
    }
  },



  /*
   * Create the TOC if it doesn't automatically exist in the page
   */
  createToc = function() {
    if ($toc.find("ol").length < 1 && !creatingToc) {
      creatingToc = true;
      $.get(Ebla.book.metaData.location +"ebla.html", function(data){
        debug("Ebla.toc: TOC added dynamically");
        $toc.append(data);
        initTocLinks();
      });
    }
  },


  /*
   *
   */
  initTocLinks = function() {
    // push TOC links through the internal loading process
    $tocLinks = $toc.find("ol a").bind("click", function(e){
      e.preventDefault();
      if (!Ebla.compatibility.isIeOld && !!e.stopPropagation) {
        e.stopPropagation();
      }
      var target = $(this).attr("href"),
          component, hash;

      // remove book default location from href
      target = target.split(Ebla.book.metaData.location)[1];

      // separate any hash values from component - need to deal with separately
      component = target.split("#")[0];
      hash = target.split("#")[1];

      // selected new component
      if (component !== Ebla.book.component) {
        suppressResize = true;

      // selected current component,
      // reset to start of component
      } else {
        Ebla.navigation.position = 0;
        Ebla.navigation.moveTo(Ebla.navigation.position);
      }

       hide(function(){
         Ebla.navigation.updateComponent(component);
      });
    });
  },



  /*
   *
   */
  tocStatus = function() {
    return tocShowing;
  },


  /*
   *
   */
  toggle = function() {
    if (!tocShowing) {
      show();
    } else {
      hide();
    }
  },


  /*
   *
   */
  show = function() {

    debug("Ebla.toc: showing TOC");
    tocShowing = true;
    preTocDimensions = Ebla.resize.cacheDimensions();
    Ebla.elements.$container.addClass('modal');
    $toc.toggleClass('show');
    $tocShim.toggleClass('overlay-shim-show');

    if (!!Ebla.compatibility.canAnimate) {
      $tocShim
        .stop()
        .css({opacity:0})
        .animate({opacity:1}, 250);
      $toc
        .stop()
        .css({opacity:0})
        .delay(250)
        .animate({opacity:1}, 250);
    }
  },


  /*
   *
   */
  hide = function(callback) {

    debug("Ebla.toc: hiding TOC");
    Ebla.elements.$container.removeClass('modal');

    // check whether dimensions have changed since we opened the TOC
    if (!suppressResize && tocShowing && !Ebla.resize.testDimensions(preTocDimensions)) {
      fireResize = true;
    }

    // if we delayed a resize event, run it now
    if (!!fireResize && !suppressResize) {
      tocShowing = false;
      fireResize = false;
      suppressResize = false;
      Ebla.resize.resized();
    }

    if (!!Ebla.compatibility.canAnimate) {
      $tocShim
        .stop()
        .css({opacity:1})
        .delay(250)
        .animate({opacity:0}, 250, function(){
          tocShowing = false;
          fireResize = false;
          suppressResize = false;
          $toc.removeClass('show');
          $tocShim.removeClass('overlay-shim-show');
          if(!!callback) {
            callback();
          }
        });

      $toc
        .stop()
        .css({opacity:1})
        .animate({opacity:0}, 250);

    } else {
      $toc.removeClass('show');
      $tocShim.removeClass('overlay-shim-show');
      tocShowing = false;
      fireResize = false;
      suppressResize = false;
      if(!!callback) {
        callback();
      }
    }
  },


  /*
   * If the toc is showing during a browser resize
   * we delay the resize event until after the toc is hidden again
   */
  fireResizeOnHide = function() {
    fireResize = true;
  };


  /*
   * Expose public methods
   */
  return {
    tocShowing: tocShowing,
    toggle: toggle,
    show: show,
    hide: hide,
    tocStatus: tocStatus,
    domLoad: domLoad,
    createToc: createToc,
    fireResizeOnHide: fireResizeOnHide,
    preTocDimensions: preTocDimensions,
    initTocLinks: initTocLinks
  };
}());