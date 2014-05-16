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