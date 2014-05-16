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