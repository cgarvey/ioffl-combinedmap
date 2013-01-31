About
=====
This is a Google Maps implementation using Google Fusion Tables to display a variety of broadband, and broadband-related, services in Ireland. It is used by [IrelandOffline](http://irelandoffline.org/).

Usage
-----
You may use the code herein, subject to the Apache Licence, below, but you do not have authorisation to use the Fusion Tables data used on this page without the prior, written consent of [IrelandOffline](http://irelandoffline.org/).

Contributing
------------
[IrelandOffline](http://irelandoffline.org/) have put this code up on Github to encourage contribute from members and non-members alike. Please use the standard practice of Github's Pull Requests to contribute your changes. Try to stick to existing coding styles. Feel free to ask us anything you're unsure of if you're considering contributing. Thanks!

Building
--------
Copy files to a web-servable folder. To update minified versions of CSS/JavaScript, use `recess` and `uglifyjs` utilities as follows:

``uglify map.js > map.min.js``

``recess --compress map.css > map.min.css``

Those two utilities are NodeJS modules. If you have NodeJS installed (and `npm`, its package manager), you can simply:

``npm install recess uglify-js -g``

*NOTE*: Be sure to make JS/CSS changes to the original files (not the minified ones)!

Change Log
----------
* v1.2 - Tidied up the Google Fusion queries, minor formatting tweaks, and bug fixes.
* v1.1 - Added some WISP coverage maps. Minor tidy up.
* v1.0 - Initial Map

License
-------
**Copyright 2012-2013 IrelandOffline. http://irelandoffline.org/**

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.

*(Free) commercial licensing available on request.*

