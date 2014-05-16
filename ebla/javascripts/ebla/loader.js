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