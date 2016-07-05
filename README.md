# Paperback

Paperback is a web based e-book reading system, in 2 parts:

1. [Ebla](#ebla), an e-book reading web app.

2. [Melk](#melk), utility to format e-book files for reading in Ebla.

Currently the only e-book file format supported by Melk/Ebla is [EPUB 2](http://idpf.org/epub/201).

[See it in action](http://monospaced.github.io/paperback).

## Contributing

Ebla and Melk are proof of concepts, further development is required!

This project is open source and MIT licenced, so please do get involved :)

See the [GitHub issues](https://github.com/monospaced/paperback/issues) for more information.

## Ebla

Ebla is an e-book reading web app.

Initally designed and developed by monospaced, thegingerbloke and carlotartaglia, Ebla has been open sourced as part of this project.

### Usage

Ebla needs to be running on the `http://` protocol, so once you have downloaded or cloned the repository, you will need to run it on a web server.

If you’re on OS X or Linux, you can simply:

1. Navigate a console to the `paperback/` directory

2. Enter `python -m SimpleHTTPServer 8888`

3. Navigate a browser to `http://localhost:8888/`

Then open the included sample book and start reading!

### Build Requirements

Ebla uses [Sass](http://sass-lang.com/) and [Grunt](http://gruntjs.com/) to preprocess and build its CSS and JavaScript files.

It comes pre-built, so you can start using it straight away. To build a new version, you will need to have Ruby, Sass, Node and NPM installed.

If you’re on OS X or Linux you probably have Ruby installed already; test with `ruby -v` in your terminal. When you’ve confirmed you have Ruby installed, run `gem install sass` to install Sass.

You can test for Node and NPM with `node -v` and `npm -v` in your terminal. If you don't have them, head over to [nodejs.org](http://nodejs.org/).

To build Ebla (with the required dependencies); from inside the `ebla/` directory run `grunt` to build once, or `grunt watch` to build automatically whenever a Sass or JavaScript file is updated.

### AngularJS

Ebla is using [AngularJS](https://angularjs.org/) to read the JSON files required to display each book. However, there is no intrinsic dependancy on AngularJS in Ebla’s current design—these aspects of the app could happily be rewritten with a server-side language, with the added benefit of removing the JavaScript dependency altogether (as the reader itself includes a no-js fallback).

## Melk

Melk is a Python command line utility that formats and stores EPUB files for reading in Ebla.

### Usage

````
python melk <options> /path/to/file.epub
````
````
python melk <options> /path/to/epubs
````

### Options

````
--version                show program's version number and exit
-h, --help               show this help message and exit
-b BOOKS, --books=BOOKS  specify path to books relative to script directory defaults to ../books/
````
### Requirements

* Python 2.6+ (not tested on Python 3)

### How it works

* Converts the XML metadata and navigation components of the EPUB file to JSON.

* Standarises the markup components of the epub file as XHTML, standardises their `<head>` elements, adds the Ebla stylesheet, and passes the plain text through [typogrify](https://github.com/mintchaos/typogrify) filters to yield typographically-improved HTML.

* Creates a folder for each converted book in a specified directory and catalogs the directory’s contents as JSON.

## Why the names?

The ancient city of Ebla is famous for its archive of roughly 20,000 cuneiform tablets, dating from around 2350 BC and written in both the Sumerian and Eblaite languages. The Ebla archive is considered (by some) to be the world’s oldest library.

Founded in the 12th century, the monastic library of Melk Abbey became renowned for its extensive manuscript collection. The monastery’s scriptorium was also a major site for the production of manuscripts.

The first Penguin paperbacks represented ease, accessibility, and democratisation of good literature—a paperback revolution.

## Sample books

[Enjoy some Paperbacks!](http://pageskip.monospaced.com/)
