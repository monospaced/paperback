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