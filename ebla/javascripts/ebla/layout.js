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