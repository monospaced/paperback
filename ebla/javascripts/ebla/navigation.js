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