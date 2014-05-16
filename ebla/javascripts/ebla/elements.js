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