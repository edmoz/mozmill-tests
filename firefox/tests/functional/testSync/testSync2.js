/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

Cu.import("resource://gre/modules/Services.jsm");

// Include required modules
var {expect} = require("../../../../lib/assertions");
var tabs = require("../../../lib/tabs");
var utils = require("../../../lib/utils");
var toolbars = require("../../../lib/toolbars");
var places = require("../../../../lib/places");
var sync = require("../../../lib/sync");

const USER = "test_user";
const DOMAIN = "restmail.net"
const PASSWORD = "password2014";

const BASE_URL = collector.addHttpResource("../../../../data/");
const BOOKMARK_URL = BASE_URL + "layout/mozilla_contribute.html";

var testUser= "";

var setupModule = function(aModule) {
  aModule.controller = mozmill.getBrowserController();
  testUser = USER + utils.appInfo.ID + utils.appInfo.version + utils.appInfo.appBuildID + "@" + DOMAIN;
}

var teardownModule = function(aModule) {
  places.restoreDefaultBookmarks();
}

var testSyncEndToEnd2 = function() {
  
  // Open sign-in page
  sync.navigateToSignin(controller);  

  // Find and fill email field
  var email = findElement.XPath(controller.tabs.activeTab, "descendant-or-self::input[contains(concat(' ', normalize-space(@class), ' '), ' email ')]");
  email.waitThenClick();
  type(email, testUser);

  // Find and fill password field
  var password = findElement.ID(controller.window.content.document, "password");
  password.click();
  type(password, PASSWORD);

  // Find and click on button
  var nextButton = findElement.XPath(controller.tabs.activeTab, "descendant-or-self::button");
  nextButton.click();
  
  // Wait and validate bookmark
  controller.tabs.activeTab.defaultView.setTimeout(function(){ checkBookmark() } , 10000);
}

var checkBookmark = function() {
  // copied from testAddBookmarkToMenu.js
  // Bug 474486
  // Until we can't check via a menu click, call the Places API function for now
  var uri = utils.createURI(BOOKMARK_URL);
  var bookmarkFolder = places.bookmarksService.bookmarksMenuFolder;
  var bookmarkExists = places.isBookmarkInFolder(uri, bookmarkFolder);
  expect.ok(bookmarkExists, "Bookmark was created in the bookmarks menu");  
}

var type = function(aElement, aString) {
  for (var i = 0, len = aString.length; i < len; i++) { 
    aElement.keypress(aString[i]);
  }
}
