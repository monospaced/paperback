/**
 * jQuery Cookie plugin
 *
 * Copyright (c) 2010 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */
jQuery.cookie = function (key, value, options) {

    // key and at least value given, set cookie...
    if (arguments.length > 1 && String(value) !== "[object Object]") {
        options = jQuery.extend({}, options);

        if (value === null || value === undefined) {
            options.expires = -1;
        }

        if (typeof options.expires === 'number') {
            var days = options.expires, t = options.expires = new Date();
            t.setDate(t.getDate() + days);
        }

        value = String(value);

        return (document.cookie = [
            encodeURIComponent(key), '=',
            options.raw ? value : encodeURIComponent(value),
            options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
            options.path ? '; path=' + options.path : '',
            options.domain ? '; domain=' + options.domain : '',
            options.secure ? '; secure' : ''
        ].join(''));
    }

    // key and possibly options given, get cookie...
    options = value || {};
    var result, decode = options.raw ? function (s) { return s; } : decodeURIComponent;
    return (result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
};

/*
 * Ebla
 * 
 * Root
 * 
 * Create Ebla name space
 */
var Ebla = {};
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

/*
 * Ebla
 * 
 * Flash
 * 
 * Create and post flash messages
 */
Ebla.flashMessage = (function(){

  /*
   * message box html element
   *
   * @var obj
   */
  var $flashMessageBox = null,


  /*
   * timeout to detect when to hide the box
   *
   * @var obj
   */
  flashMessageTimeout = null,


  /*
   * Time in milliseconds to display the flash message
   *
   * @var int
   */
  visibleTime = 2000,


  /*
   * 
   */
  domLoad = function() {        
    $flashMessageBox = $("<div />")
      .attr("id", "flash-message-box")
      .html("<ul></ul>")
      .css({opacity:0})
      .appendTo(Ebla.elements.$container);
        
    // don't hide the box on hover
    $flashMessageBox.hover(
      function() { clearTimeout(flashMessageTimeout); },
      function() { hideflashMessageTrigger(); }
    );
  },


  /*
   * write a flash message
   * 
   * PUBLIC
   *
   * @var message {string} the message to flash
   */
  post = function(message) {

    if (window.console && window.console.log) {
      console.log(message);
    }
        
    if (!$flashMessageBox) { return; }

    // add message
    $flashMessageBox.find("ul").prepend("<li>"+message+"</li>");

    // stop box disappearing
    clearTimeout(flashMessageTimeout);

    // show box
    if (!Ebla.compatibility.canAnimate) {
      $flashMessageBox.css({opacity:1, display:"block"});
      hideflashMessageTrigger();
    } else {
      $flashMessageBox
        .stop()
        .css({display:"block"})
        .animate({opacity:1}, 500, function(){
          hideflashMessageTrigger();
        });
    }
  },

  /*
   * Hide box
   */
  hideflashMessage = function() {

    if (!Ebla.compatibility.canAnimate) {
      $flashMessageBox.css({opacity:0,display:"none"});
      $flashMessageBox.html("<ul></ul>");
    } else {
      $flashMessageBox
        .animate({opacity:0}, 500,
          function() {
            $flashMessageBox
              .html("<ul></ul>")
              .css({display:"none"});
            });
    }

    if (window.console && window.console.log) {
      console.log("-------------");
    }
  },


  /*
   * Start countdown to hide box
   */
  hideflashMessageTrigger = function() {
    flashMessageTimeout = setTimeout(hideflashMessage, visibleTime);
  };


  /*
   * Expose public methods
   */
  return {
    post: post,
    domLoad: domLoad
  };
}());
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
/*
 * Ebla
 * 
 * Elements
 * 
 * Centralised store for HTML elements used throughout Ebla
 */
Ebla.elements = {

  /*
   * jQuery window object
   * 
   * @var 
   */
  $window : $(window),

  /*
   * jQuery document object
   * 
   * @var 
   */
  $document : $(document),

  /*
   * main HTML body element - jQuery object
   *
   * @var 
   */
  $body : null,

  /*
   * HTML container div
   *
   * @var 
   */
  container : null,

  /*
   * jQuery object of HTML container div
   *
   * @var 
   */
  $container : null,

  /*
   * HTML wrapper for iframe
   *
   * @var 
   */
  main : null,

  /*
   * iframe
   *
   * @var 
   */
  sandbox : null,

  /*
   * iframe jQuery object
   *
   * @var 
   */
  $sandbox : null,

  /*
   * page header
   *
   * @var 
   */
  $header : null,

  /*
   * page footer
   *
   * @var 
   */
  $footer : null,

  /*
   * html body element within iframe
   *
   * @var 
   */
  frame : null, 

  /*
   * jQuery object of html body element within iframe
   *
   * @var 
   */
  $frame : null,


  /*
   * Have to wait until the DOM is loaded before retrieving components
   */
  domLoad : function() {        
    this.container = document.getElementById('container');
    this.$container = $("#container");
    this.main = document.getElementById('main');
    this.sandbox = document.getElementById('sandbox');
    this.$sandbox = $("#sandbox");
    this.$header = $('.header');
    this.$footer = $('.footer');
    this.$body = $("body");
    this.frame = window.frames.sandbox.document.getElementsByTagName('body')[0];
    this.$frame = $(this.frame);
  }
};
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
/*
 * Ebla
 * 
 * Data
 * 
 * save and retrieve data functionality
 * abstracts use of localstorage or cookies
 * dependent on Modernizr and browser support 
 * Uses book ID so save points can be stored for each book
 *
 */
Ebla.data = (function() {

  /* 
   * 
   */
  var store = function(key, value) {
    key = key+"-"+Ebla.book.metaData.id;
    if (Ebla.compatibility.hasLocalStorage) {
      localStorage.setItem(key, value);
    } else {
      $.cookie(key, value, { expires: 14, path: '/' });
    }
  },


  /*
   *
   */
  retrieve = function(key) {
    key = key+"-"+Ebla.book.metaData.id;
    if (Ebla.compatibility.hasLocalStorage) {
      return localStorage.getItem(key);
    } else {
      return $.cookie(key);
    }
  };


  /*
   * Expose public methods
   */
  return {
    store: store,
    retrieve: retrieve
  };
}());
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
/*
 * Ebla
 * 
 * Layout
 * 
 * Controls and stores information about how book content is displayed
 */
Ebla.layout = {

  /*
   *
   * 
   * @var 
   */
  fontSize : 16,

  /*
   *
   * 
   * @var 
   */
  lineHeight : 26,

  /*
   *
   * 
   * @var 
   */
  width : null,

  /*
   *
   * 
   * @var 
   */
  height : null,

  /*
   *
   * 
   * @var 
   */
  pageSize : null,

  /*
   *
   * 
   * @var 
   */
  pageEnd : null,

  /*
   *
   * 
   * @var 
   */
  pageStart : 0,
  
  
  
  /*
   * Master method to calculate various iframe dimensions, below
   */
  calculateDimensions : function (isInit) {
    
    if (isInit) {
      this.setFontSize();
      this.setLineHeight();

      if (!Ebla.compatibility.hasCssColumns) {
        this.strictRhythm();
      }
    } else {
    
      // reset position of frame before re-calculating dimensions.  
      // This means the iframe scroll width will be calculated correctly
      // The new 'correct' position within the iframe will be set after
      // the new dimensions have been calculated
      Ebla.elements.frame.style.top = 0;
      Ebla.elements.frame.style.left = 0;
    }

    // set dimensions
    this.setPageWidth();
    this.setPageHeight();
    this.setPageSize();
    this.setPageEnd();
  },


  /*
   *
   */
  setFontSize : function() {
    this.fontSize = Ebla.elements.$frame.css('font-size');
  },


  /* 
   * 
   * 
   * compute line-height as integer 
   */
  setLineHeight : function() {

    var fontSize = this.fontSize,
        el = Ebla.elements.frame,
        lineHeight,
        ruler;

    if (window.getComputedStyle) {
      lineHeight = document.defaultView.getComputedStyle(el,null).getPropertyValue('line-height');
    } else if (el.currentStyle) {
      lineHeight = el.currentStyle.lineHeight;
    } 
    if (!isNaN(lineHeight)) {
      /* unitless, multiply by pixel font-size */
      lineHeight = Math.round(lineHeight*parseInt(fontSize,10));
    } else if (lineHeight.indexOf('px') !== -1) { 
      /* we have pixels, yay */
      lineHeight = parseInt(lineHeight,10);
    } else if (lineHeight.indexOf('em') !== -1 || lineHeight.indexOf('%') !== -1) { 
      /* relative, multiply by pixel font-size */
      lineHeight = Math.round(parseInt(lineHeight,10)*parseInt(fontSize,10));
    } else {
      /* last resort, create a shim and measure it */
      ruler = document.createElement('p');
      ruler.innerHTML = 'm';
      ruler.style.visibility = 'hidden';
      ruler.style.fontSize = 'inherit';
      el.appendChild(ruler); 
      lineHeight = ruler.clientHeight;
      el.removeChild(ruler);
    }
    this.lineHeight = lineHeight;
  },


  /*
   *
   */
  setPageWidth : function() {

    var main = Ebla.elements.main,
        frame = Ebla.elements.frame,
        sandbox = Ebla.elements.sandbox,
        fontSize = this.fontSize, 
        width;

    main.style.fontSize = fontSize; 
    width = main.offsetWidth;
    sandbox.style.width = width+'px';
    frame.style.WebkitColumnWidth = width+'px';
    frame.style.MozColumnWidth = width+'px';
    frame.style.columnWidth = width+'px';

    // Fix devices that need a minimum width in order to render columns correctly
    if (Ebla.compatibility.needsDoubleWidthFix) {
      frame.style.minWidth = "200%";
    }

    this.width = width;  
  },


  /*
   *
   *
   */
  setPageHeight : function() {

    var main = Ebla.elements.main,
        frame = Ebla.elements.frame,
        sandbox = Ebla.elements.sandbox,
        lineHeight = this.lineHeight,
        height,
        winHeight;

    if (window.innerHeight) { // =ISSUE_05 replace this feature detect with jQuery?
      winHeight = window.innerHeight;
    } else if (document.documentElement.clientHeight) {
      winHeight = document.documentElement.clientHeight;
    }
    
    // set correct height for devices that incorrectly  
    // calculate these dimensions
    if (Ebla.compatibility.hasIframeDimensionsBug) {
      // 
    }

    if(!Ebla.compatibility.isMobile) {
      main.style.paddingTop = (lineHeight*2)+'px';
      height = Math.floor((winHeight / lineHeight)-4)*lineHeight;
    } else {
      main.style.paddingTop = (lineHeight*0.84)+'px';
      height = Math.floor((winHeight / lineHeight)-2)*lineHeight;
    }
    main.style.height = height+'px';
    frame.style.height = height+'px';
    sandbox.style.height = height+'px';

    this.height = height;
  },
  
  
  /*
   *
   *
   */
  getScrollWidth : function(frame,width) {

    var scrollWidth = frame.scrollWidth,
        elems, bdyRect, l, r, b, rect, i;
        
    /* =ISSUE_02 seperate from the 'iframe double scroll bug'
       some browsers always report the scrollWidth as a single page.
       in this case, we can get the correct value 
       using this getBoundingClientRect technique.
       inefficent, be good to improve this (jQuery?) */
    if (scrollWidth === width && frame.getBoundingClientRect) {
            
      elems = frame.getElementsByTagName('*');
      bdyRect = frame.getBoundingClientRect();
      l = bdyRect.left;
      r = bdyRect.right;

      for (i = elems.length - 1; i >= 0; --i) {
        rect = elems[i].getBoundingClientRect();
        l = Math.min(l, rect.left);
        r = Math.max(r, rect.right);
      }
            
      l = Math.abs(l);
      r =  Math.abs(r);
      scrollWidth = (l+r);

    /* =ISSUE_01 
       returns incorrect width for browsers with 'iframe double scroll bug'
       unless min-width 200% set on the component body
       (see https://github.com/joseph/Monocle/blob/master/src/dimensions/columns.js)
       affecting Kindle (and possibly old iOS). 
       need some sniffing to know when to apply the min-width 200%, 
       & then a workaround for this case to detect 1 page components
       ?? can possible standardize this using jQuery methods?

        if we've fixed the min-width to 200%, then it will
        always report page width as two pages.  To detect 
        single pages we need to check that there are no 
        elements on this second page
   */
    } else if (scrollWidth === width * 2 && Ebla.compatibility.needsDoubleWidthFix) {
      elems = frame.getElementsByTagName('*');
      r = 0;
      b = this.height;
      for (i = elems.length - 1; i >= 0; --i) {
        rect = elems[i].getBoundingClientRect();
        r = Math.max(r, rect.right);
        b = Math.max(b, rect.bottom);
      }
      r = Math.abs(r);
      b = Math.abs(b);

      if (r === width) {
        scrollWidth = width;
        
        /* 
         one last test: 
         if an element (e.g. <p>) started in the first column but ended in the second,
         sometimes it won't return the correct 'rect.right' value, but its rect.bottom 
         will be larger than the page height.  
         If this occurs, then there is a second column, so double the scrollWidth.
        */
        if (b > this.height) {
          scrollWidth *= 2;
        }
      }
          
    // no issue - scroll width has been recorded
    } else {

    }
    return -scrollWidth;
  },


  /*
   *
   */
  getScrollHeight : function(frame, height) {
    return -Math.ceil(frame.scrollHeight / height) * height;
  },


  /*
   *
   */
  setPageSize : function(){
    this.pageSize = (Ebla.compatibility.hasCssColumns) ? this.width : this.height;
  },


  /*
   *
   */
  setPageEnd : function(){
    var frame = Ebla.elements.frame,
        width = this.width,
        height = this.height;
    this.pageEnd = (Ebla.compatibility.hasCssColumns) ? this.getScrollWidth(frame, width) : this.getScrollHeight(frame, height);
  },


  /* 
   * hyphenation
   */
  hyphenation : function(frame){
    // =ISSUE_03 
    /* function is inefficent,
       could do this instead...
    if (!csshyphens) {
      frame.className += ' ebla-no-csshyphens';
    } 
    ...then do the best we can in pure css 
       see =hyphenation in stylesheets/book.css for more info
       ...not sure */
    var elems = $(frame).find('*'), 
      $elem;
    for (var i = elems.length; i--; ) {
      $elem = $(elems[i]);
      if ($elem.css('text-align') === 'justify' && 
          $elem.css('display') !== 'inline') {
        //identify all elements with css text-align value of 'justify'
        if (Ebla.compatibility.hasCssHyphens) {
          //enable hyphens:auto if supported
          $elem.css('-webkit-hyphens','auto');
          $elem.css('-moz-hyphens','auto');
          $elem.css('-hyphens','auto');
        } else {
          //otherwise set text-align to left
          $elem.css('text-align','left');
        }
      }
    }
  },


  /* 
   * strict rhythm
   * adjust image and object padding to maintain vertical rhythm
   * only required for vertical pagination (no-csscolumns)
   */
  strictRhythm : function (){ 

    var frame = Ebla.elements.frame,
      lineHeight = this.lineHeight,
      $elems = $(frame).find('img','object');
      
    for (var i = $elems.length; i--; ) {
      var elem = $elems[i],
          $elem = $(elem),
          $parent = $elem.parent(),
          height,
          newHeight,
          padding,
          children = $parent.contents(),
          child,
          fixEl = true;
      
      // calculate whether to apply the fix - required conditions: 
      // 1) image is only child within parent element
      // 2) image and empty #text nodes
      // 3) image and empty [element] nodes
      for (var counter = children.length - 1; counter >= 0; counter--){
        child = children[counter];
        // if it's an image, it doesn't have a length
        // empty #text nodes have a length of 1
        //debug("Ebla.layout: testing el '" + child.nodeName + "' (length: "+(child.innerHTML && child.innerHTML.length > 0)+")");
        if (child.length && ((child.nodeName === "#text" && child.length > 1)) || (child.innerHTML && child.innerHTML.length > 0)) {
          fixEl = false;
          break;
        }
      }
      
      // only if we passed the above test should we enforce strict rhythm on the current element
      if (fixEl) {
        height = $elem.height();
        newHeight = Math.ceil(height / lineHeight)*lineHeight;
        padding = (newHeight-height);
        elem.style.cssText = 'display:block !important;padding-bottom:'+padding+'px !important;';
        debug("Ebla.layout: Applying strict rhythm to " + elem.src);

        // easily test what has changed - set a bg colour
        //$parent.css({background:"#f90"});
      }
    }
  }
};
/*
 * Ebla
 * 
 * Loader
 * 
 * Show and hide the main loader 
 */
Ebla.loader = {

  /*
   * The HTML loader element 
   * 
   * @var jQuery obj
   */
  $loader : null, 

  /*
   * Is the loader currently displayed?
   * 
   * @var bool
   */
   loading : false,

  /*
   * Loader type:
   * background animated GIF / 
   * 
   * 
   * 
   * @var string
   */
  loaderType: null,

  /*
   * The loader 'alt' state interval, for static loader
   *
   * @var interval
   */
  loaderInterval : null,


  /*
   * 
   */
  domLoad : function() {

    this.$loader = $("#loader");
    
    if (!Ebla.compatibility.hasCssAnimations){
      this.$loader.addClass('gif');
    }

  },


  /* 
   * loader icon functionality
   * show and hide the loader, with an optional callback
   * if current user agent doesn't animate, don't show loader 
   */
  show : function(callback) {
    
    //debug("Ebla.loader: show loader");

    this.loading = true;

    // condition : create loader?
    this.$loader
//      .stop()
      .css({display:"block"})
      .animate({opacity:1}, 250,
        function() {
          this.loading = false;
          if (!!callback) {
            callback();
          }
        });
  },


  /*
   *
   */
  hide : function(callback) {
    
    //debug("Ebla.loader: hide loader");
    if (!Ebla.compatibility.canAnimate) {
      this.$loader.css({opacity:0,display:"none"});
      clearInterval(this.loaderInterval);
      if (!!callback) { callback(); }
        return;
      }
        
      if (!!this.$loader) {
        this.loading = true;
        this.$loader
          .animate({opacity:0}, 500,
            function() {
              Ebla.loader.loading = false;
              Ebla.loader.$loader.css({display:"none"});
              if (!!callback) {
                callback();
              }
            });
      }
  }
};
/*
 * Ebla
 * 
 * Navigation
 * 
 * Store and control ebook navigation in Ebla
 * (Both moving within a component, and loading new components)
 */
Ebla.navigation = {

  /*
   * Current 'left' position of the iframe
   * Used to determine whether to switch to a new component or not
   * 
   * @var 
   */
  position : 0,

  /*
   * Are we moving back to the previous component?
   * 
   * @var bool
   */
  hackBack : false,

  /*
   * Fix browser scroll position - interval
   *
   * @var obj
   */
  scrollPositionFixInterval: null,

  /*
   * move the iframe positioning
   */
  moveTo : function(position) {
    var frame = Ebla.elements.frame;
    if (Ebla.compatibility.hasCssColumns) {
      frame.style.left = position+'px';
    } else {
      frame.style.top = position+'px';
    }
    Ebla.progress.updateProgressBar();
    Ebla.placesaver.save();
    
    // show/hide forward/back arrows at start/end of book
    Ebla.controls.showHideNavArrows();
  },


  /* 
   * calculate how to turn the page
   */
  turnPage : function(direction) {

    //debug("Ebla.navigation: turning page " + direction);

    var _component, 
        turnPage = true;

    // next page
    if (direction === 'forward') {
      this.hackBack = false;

      // if not end of current component
      if (this.position <= Ebla.layout.pageEnd + Ebla.layout.pageSize) {

        // end of book
        if (Ebla.book.componentIndex === Ebla.book.components.length-1) {
          turnPage = false;

        // starting a new component
        } else {
          _component = Ebla.book.components[Ebla.book.componentIndex+1];
          this.updateComponent(_component);
          turnPage = false;
        }
      }
      if (!!turnPage) {
          this.position = this.position - Ebla.layout.pageSize;
      }

    // previous page
    } else if (direction === 'backwards') {
      if (this.position >= Ebla.layout.pageStart) {

        // start of book
        if (Ebla.book.componentIndex === 0) {
          turnPage = false;

        // going back to a previous component
        } else {
          _component = Ebla.book.components[Ebla.book.componentIndex-1];
          this.hackBack = true;
          this.updateComponent(_component);
          turnPage = false;
        }
      } else {
        this.position = this.position + Ebla.layout.pageSize;
      }
    }

    // condition : turn the page, if not start/end of book, or loading a new component
    // only save the reading point now if we're staying in the current component, otherwise
    // wait until the component has loaded before saving, as stats are recalculated on load
    if (!!turnPage) {
      debug("Ebla.navigation: moving position to " + this.position);
      this.moveTo(this.position);
    }

    // hide any visible controls
    Ebla.controls.hide();
  },



  /* 
   * update component
   * replace existing chapter with a new one
     */
  updateComponentSrc : function(component, percentageRead, hash) {
    Ebla.loader.show(function(){
      Ebla.elements.$sandbox.attr('src',component);
      Ebla.elements.$sandbox.bind('load.update',function(){
        Ebla.controls.hide();
        Ebla.loader.hide();
        Ebla.elements.$sandbox.unbind('load.update');

        // if we need to jump to a specific place within the component, 
        // we had to wait until it's finished loading first, so do it now
        if (percentageRead !== 0) {
          Ebla.navigation.position = Ebla.navigation.calculatePositionFromPercentageRead(percentageRead);  
          
        // if we need to jump to a specific hash
        } else if (!!hash) {
          Ebla.navigation.position = Ebla.navigation.calculatePositionFromHash(hash);  

        // if turning backwards to the end of a previous component
        // adjust position to show final page of new component
        } else if (Ebla.navigation.hackBack) {
          Ebla.navigation.position = Ebla.layout.pageEnd + Ebla.layout.pageSize;
          Ebla.navigation.hackBack = false;
            
        // no set position, start from the beginning
        } else {
          Ebla.navigation.position = 0;
        }
            
        Ebla.navigation.moveTo(Ebla.navigation.position);
      });
    });
  },



  /*
   * handle internal link click
   */
  updateComponent: function(component, percentageRead, hash) {
    
    if (!percentageRead) { 
      percentageRead = 0; 
    }
    
    // if it's the current component, jump to specific place?
    if (component === Ebla.book.component) {
      if (!!hash) {
        this.position = this.calculatePositionFromHash(hash);
      } else {
        this.position = this.calculatePositionFromPercentageRead(percentageRead);
      }
      
      this.moveTo(this.position);
      Ebla.loader.hide();
      debug("Ebla.navigation: Resetting current component " + Ebla.book.componentIndex + " ("+component+")");

    // load new component
    } else {
      Ebla.book.componentIndex = $.inArray(component,Ebla.book.components);
      if (Ebla.book.componentIndex === -1) { Ebla.book.componentIndex = 0; }
      debug("Ebla.navigation: Loading component " + Ebla.book.componentIndex + " ("+component+")");
      this.updateComponentSrc(Ebla.book.metaData.location+component, percentageRead, hash);
    }
  },



  /*
   * calculatePositionFromPercentageRead
   * 
   * Can only occur once a component has laoded, as we need to use
   * various parameters from the component layout
   */
  calculatePositionFromPercentageRead: function(percentageRead) {
    return (percentageRead > 0) ? -(Math.floor((Math.abs(Ebla.layout.pageEnd) * (percentageRead/100)) / Ebla.layout.pageSize) * Ebla.layout.pageSize) : 0;
  },
  
  
  
  /*
   * calculatePositionFromHash
   * 
   * Can only occur once a component has laoded
   * Look through component for an element with the ID of the hash
   * If found, get the 'page' that it's on, otherwise start from the beginning 
   */
  calculatePositionFromHash: function(hash) {
    
    debug("Ebla.navigation: searching component for hash ID: #" + hash);
    
    var pos = 0, offset, $hashEl;
    
    // Look through component for an element with the ID of the hash
    $hashEl = Ebla.elements.$frame.find("#"+hash);
    
    // If found, get the 'page' that it's on
    if ($hashEl.length > 0) {

      // find position of element
      offset = $hashEl.position();
      
      // calculate what page this is on
      if (Ebla.compatibility.hasCssColumns) {
        pos = -Math.floor(offset.left/Ebla.layout.pageSize) * Ebla.layout.pageSize;
      } else { 
        pos = -Math.floor(offset.top/Ebla.layout.pageSize) * Ebla.layout.pageSize;
      }
    }
    
    // otherwise start from the beginning     
    return pos;
  },


  /*
   * When a new component has loaded, 
   * Apply a fix for any unintentional scrolling
   */
  fixInnerScroll: function() {

    $(window.frames.sandbox).unbind("scroll");
    $(window.frames.sandbox).bind("scroll", function(e){
      e.preventDefault();
      e.stopPropagation();
      resetScrollPosition();
    });
    
    // if the event above doesn't fire automatically, we need to poll for any changes
    if (Ebla.compatibility.hasNoScrollEventBug) {
      
      // for browsers that suffer from a repaint/reflow bug, 
      // overlay hidden element that triggers a redraw
      $("<span/>").addClass("e-ink-fix").appendTo(Ebla.elements.$container);
      
      clearInterval(this.scrollPositionFixInterval);
      this.scrollPositionFixInterval = setInterval(function(){
        resetScrollPosition();
      }, 100);
    }
    
    var resetScrollPosition = function() {
      if (window.frames.sandbox.document.body.scrollLeft > 0) {
        window.frames.sandbox.document.body.scrollLeft = 0;
        debug("Ebla.navigation: Fixing unregistered scroll");
      }
    };
  }
};
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
/*
 * Ebla
 * 
 * keyboard navigation
 * 
 */
Ebla.navigation.keyboard = (function(){

  /* 
   * keyboard navigation
   * 37:left; 38:up; 39:right; 40:down; 32:space; 33:page-up; 34:page-down; i: 73; x: 88;
   */
  var handleKeyDown = function(e){

    if (Ebla.loader.loading) { return; }

    debug("Ebla.navigation.keyboard: detected keypress " + e.keyCode);

    switch (e.keyCode) {

      // previous page
      case 37: // left
      case 33: // page-up
      case 80: // p
        if (Ebla.toc.tocStatus()) { return; }
        Ebla.navigation.turnPage('backwards');
        e.preventDefault();
      break;

      // next page
      case 39: // right
      case 32: // space 
      case 34: // page-down
      case 78: //n
        if (Ebla.toc.tocStatus()) { return; }
        Ebla.navigation.turnPage('forward');
        e.preventDefault();
      break;

      // show TOC/nav
      case 73: // i
        //e.preventDefault();
        Ebla.controls.show();
        Ebla.toc.toggle();
      break;

      // hide TOC
      case 88: // x
        //e.preventDefault();
        Ebla.toc.hide();
      break;
    }
  };


  return {
    handleKeyDown: handleKeyDown
  };
}());
/*
 * Ebla
 * 
 * Placesaver
 * Save and restore position in book
 */
Ebla.placesaver = (function(){

  /* 
   * placesaver
   * save the current point in the book: detect location (component and % through)
   * 
   * save: on state change (page turn) or when a new component has loaded
   * restore: on page load, resize
   * 
   * allows global variable overloading
   */
  var save = function(percentageRead, componentIndex) {

    // if we are part-way through a component, calculate % through current component
    percentageRead = percentageRead || (Math.abs(Ebla.navigation.position) > 0) ? Math.round((Ebla.navigation.position / Ebla.layout.pageEnd) * 100) : 0;
    componentIndex = componentIndex || Ebla.book.componentIndex;

    debug("Ebla.placesaver: Saving: " + percentageRead + "%, component " + Ebla.book.componentIndex + " (pos: " + Ebla.navigation.position + " of " + Ebla.layout.pageEnd + ")");

    // save position as percentage through
    Ebla.data.store('percentageRead', percentageRead);
    Ebla.data.store('componentIndex', componentIndex);
  },


  /*
   *
   */
  restore = function(percentageRead, componentIndex) {

    var _component;

    percentageRead = percentageRead || Ebla.data.retrieve('percentageRead');
    componentIndex = componentIndex || Ebla.data.retrieve('componentIndex');

    debug("Ebla.placesaver: restore - component:"+ componentIndex+", "+percentageRead+"% read");

    // if there is saved data, process current point 
    if (!!percentageRead && !!componentIndex) {

      _component = Ebla.book.components[componentIndex];
      Ebla.navigation.updateComponent(_component, percentageRead);

    // no save data, show content
    } else {
      Ebla.loader.hide();
    }
  };


  return {
    save:save,
    restore:restore
  };
}());
/*
 * Ebla
 * 
 * Progress
 * 
 * Create and update progress bar
 */
Ebla.progress = {

  /*
   * The HTML progress bar
   * 
   * @var 
   */
  $progressBar : null, 

  /*
   * The progress fill element, who's width gets adjusted
   * 
   * @var 
   */    
  $progressFill : null,

  /*
   * The HTML element that contains the progress text
   * (e.g. 97%)
   * 
   * @var 
   */    
  $percentThru : null,


  /*
   * update progress bar
   */
  updateProgressBar : function() {

    var amountRead,
        percentageRead,
        componentLength,
        componentPercentageRead;

    // calculate current progress based on start of current component 
    // (not including current chapter)
    componentLength = Ebla.book.contentSizes[Ebla.book.componentIndex]; 
    amountRead = Ebla.book.cumulativeSizes[Ebla.book.componentIndex] - componentLength;

    // percentage of current component read
    // add Ebla.layout.pageSize to position, to include the current page in the calculation
    componentPercentageRead = Math.abs(Ebla.navigation.position)/Math.abs(Ebla.layout.pageEnd);

    // add to existing percentage read
    amountRead += componentLength*componentPercentageRead;

    // calculate overall percentage read
    percentageRead = ((amountRead/Ebla.book.contentLength)*100).toFixed(2);
    
    // hack - at the end of the book show 100%
    if (Ebla.navigation.position <= Ebla.layout.pageEnd + Ebla.layout.pageSize && Ebla.book.componentIndex === Ebla.book.components.length-1) {
      percentageRead = 100;
    }

    debug("Ebla.progress: set current progress: " + percentageRead + "%");
      
    // display the progress
    this.$progressFill.css({width:percentageRead+"%"}); // fill by 2s.f., for fine-grained movement 
    this.$percentThru.html(Math.round(percentageRead)+"%"); // adjust visual value by whole numbers only
  },


  /*
   * create bar
   */
  createProgressBar : function() {

    this.$progressBar = $("<div />")
      .attr("class", "progress-bar")
      .prependTo(Ebla.elements.$footer);

    var $progressBg = $("<div />") // local var, doesn't need to be accessed globally
      .attr("class", "progress-bg")
      .appendTo(this.$progressBar);

    this.$progressFill = $("<div />")
      .attr("class", "progress-fill")
      .appendTo($progressBg);

    this.$percentThru = $("<p />")
      .attr("class", "percent-thru")
      .appendTo(Ebla.elements.$footer);

  },


  /*
   * add markers to progress bar
   * occurs after all book data has been parsed
   */
  addProgressMarkers : function() {
    if (Ebla.book.contentMarkers.length > 0) {

      var bookComponent, pos, $li, $marker, title,
        $markerList = $("<ol />")
          .addClass("content-markers")
          .appendTo(this.$progressBar),
        truncateLimit = 25, 
        leftLimit = 50;

      $.each(Ebla.book.contentMarkers, function(counter){
        bookComponent = this;
        pos = (((bookComponent.cumulativeSize - bookComponent.size)/Ebla.book.contentLength)*100).toFixed(2);
        title = (bookComponent.title.length < truncateLimit) ? bookComponent.title : bookComponent.title.substring(0, truncateLimit) + "…";

        $li = $("<li />")
          .css({left:pos+"%"})
          .addClass("marker marker-left")
          .appendTo($markerList);

        if (pos > leftLimit) {
          $li
            .addClass("marker-right")
            .removeClass("marker-left");
        }

        $marker = $("<a />")
          .attr("href", Ebla.book.metaData.location+bookComponent.hash)
          .html("<span></span><strong>"+title+"</strong>")
          .appendTo($li);

        $marker.bind("click", function(e){
          e.preventDefault();
          if (!Ebla.compatibility.isIeOld && !!e.stopPropagation) {
            e.stopPropagation();
          }
          var target = $(this).attr("href"), 
              component, hash;

          // remove book default location from href
          target = target.replace(Ebla.book.metaData.location, '');

          // separate any hash values from component - need to deal with separately
          hash = target.split("#")[1];
          component = target.split("#")[0];

          Ebla.navigation.updateComponent(component);
        });

        //debug("Ebla.progress: adding marker at "+pos+"% to the progress bar");
      });
    }
  }
};
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
/*
 * Ebla
 *
 * Book
 *
 * Retrieves, parses and stores book data from book json file
 */
Ebla.book = {

  /*
   * contentData part of book.json
   *
   * @var bool
   */
  contentData : null,

  /*
   * metaData part of book.json
   *
   * @var
   */
  metaData : null,

  /*
   * just the component hashes of all book components
   *
   * @var
   */
  components : [],

  /*
   * current book component hash
   *
   * @var
   */
  component : null,

  /*
   * id of current book component
   *
   * @var
   */
  componentIndex : 0,

  /*
   * all markers
   *
   * @var
   */
  contentMarkers : [],

  /*
   * size of each component
   *
   * @var
   */
  contentSizes : [],

  /*
   * cumulative size at each component
   *
   * @var
   */
  cumulativeSizes : [],

  /*
   * total book length
   *
   * @var
   */
  contentLength : 0,

  /*
   * has the book data loaded?
   *
   * @var
   */
  dataLoaded : false,


  /*
   * Run when the dom has loaded
   *
   */
  domLoad : function() {

    // request bookData via AJAX?
    if (!window.bookData) {

      // retrieve and process book data
      $.ajaxSetup({ scriptCharset: "utf-8" , contentType: "application/json; charset=utf-8"});
      $.ajax({
        url: bookJson,
        dataType:"json",
        success: function(data){
          Ebla.book.parseBookData(data);
        },
        error: function(data) {
          debug(data);
        }
      });

    // book data exists, parse now
    } else {
      Ebla.book.parseBookData(bookData);
    }
  },



  /*
   * parse book data
   */
  parseBookData: function(data) {
    Ebla.book.contentData = data.contentData;
    Ebla.book.metaData = data.metaData;

    Ebla.book.parseComponentData(data.contentData);
    debug("Ebla.book: Book data parsed");

    Ebla.book.dataLoaded = true;

    debug("Ebla.book: creating progress bar in book data");
    Ebla.progress.createProgressBar();
    Ebla.progress.addProgressMarkers();

    Ebla.book.addBookMetaDataToPage();

    if (!Ebla.init.inited && Ebla.init.windowLoaded) {
      debug("Ebla.book: initing after book data loaded");
      Ebla.init.init();
      Ebla.init.inited = true;
      Ebla.placesaver.restore();
    }
  },


  /*
   * parse component data
   * call self to handle recursion - child nodes
   */
  parseComponentData : function(contentData) {
    var bookComponent, component;
    $.each(contentData, function(counter) {
      bookComponent = this;

      // #33 - remove any hash values - don't currently work with book placement system
      component = bookComponent.hash.split("#")[0];

      // prevent duplicate components in array
      if ($.inArray(component,Ebla.book.components) === -1) {
        Ebla.book.components.push(component);
      }

      Ebla.book.contentLength += bookComponent.size;
      Ebla.book.contentSizes.push(bookComponent.size);
      Ebla.book.cumulativeSizes.push(Ebla.book.contentLength);
      bookComponent.cumulativeSize = Ebla.book.contentLength;

      // condition : add chaper marker?
      if (!!bookComponent.marker) {
        Ebla.book.contentMarkers.push(bookComponent);
      }

      // condition : parse children?
      if (!!bookComponent.children) {
        Ebla.book.parseComponentData(bookComponent.children);
      }
    });
  },


  /*
   * If it doesn't already exist, add book title/author into page
   */
  addBookMetaDataToPage: function() {
    var $title = $("title"),
        $bookTitle = $("h1 cite"),
        $bookAuthor = $("h1 span.author");

    if ($bookTitle.text().length < 1) {
      $bookTitle.text(Ebla.book.metaData.title);
      //$title.text(Ebla.book.metaData.title + " | Ebla");
    }

    if ($bookAuthor.text().length < 1) {
      $bookAuthor.text(Ebla.book.metaData.creator);
    }
  }
};