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