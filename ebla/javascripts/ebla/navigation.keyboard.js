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