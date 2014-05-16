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