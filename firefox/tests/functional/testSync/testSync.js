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
const MAIL_SERVER = "http://restmail.net/mail/"
const VERIFY_SERVICE = "https://accounts.firefox.com/verify_email"

const BASE_URL = collector.addHttpResource("../../../../data/");
const BOOKMARK_URL = BASE_URL + "layout/mozilla_contribute.html";

var regex = /uid=\w*&code=\w*&service=\w*/;
var testUser = "";

var setupModule = function(aModule) {
  aModule.controller = mozmill.getBrowserController();
  aModule.locationBar =  new toolbars.locationBar(aModule.controller);
  aModule.signUpSite = new sync.SignUpSite(aModule.controller);
  testUser = USER + utils.appInfo.ID + utils.appInfo.version + utils.appInfo.appBuildID + "@" + DOMAIN;
}

var testSyncEndToEnd = function() {

  // Open signup page
  sync.navigateToSignup(controller);
  
  // Find and fill email field
  signUpSite.typeEmail(testUser);

  // Find and fill password field
  signUpSite.typePassword(PASSWORD);

  // Find and select valid age
  signUpSite.selectAge(2);

  // Find and click on button
  signUpSite.clickNextButton();
  
  // Wait for e-mail
  var xmlHttp = new controller.tabs.activeTab.defaultView.XMLHttpRequest;
  var response = "[]";
  
  controller.waitFor(function () { 
    xmlHttp.open( "GET", MAIL_SERVER + testUser, false );
    xmlHttp.send( null );
    response = xmlHttp.responseText;
    return response != "[]";
  }, "Waiting for an email", 100000, 1000);
  
  // Get url params from email
  var match = regex.exec(response);
  
  // Verify email address
  controller.open(VERIFY_SERVICE + "?" + match[0]);
  controller.waitForPageLoad();
  var accountVerifiedHeader = findElement.ID(controller.window.content.document, "fxa-complete-sign-up-header");
  accountVerifiedHeader.waitForElement(100000, 1000);
  expect.ok(accountVerifiedHeader.exists(), "User is on complete sign up page");
  
 
  // Open URI and wait until it has been finished loading
  var uri = utils.createURI(BOOKMARK_URL);
  controller.open(uri.spec);
  controller.waitForPageLoad();

  // Open the bookmark panel via bookmarks menu
  controller.mainMenu.click("#menu_bookmarkThisPage");

  // editBookmarksPanel is loaded lazily. Wait until overlay for StarUI has been loaded
  locationBar.editBookmarksPanel.waitForPanel();

  // Bookmark should automatically be stored under the Bookmark Menu
  var nameField = locationBar.editBookmarksPanel.getElement({type: "nameField"});
  var doneButton = locationBar.editBookmarksPanel.getElement({type: "doneButton"});

  controller.type(nameField, "Mozilla");
  controller.click(doneButton);
  
  // copied from testAddBookmarkToMenu.js
  // Bug 474486
  // Until we can't check via a menu click, call the Places API function for now
  var bookmarkFolder = places.bookmarksService.bookmarksMenuFolder;
  var bookmarkExists = places.isBookmarkInFolder(uri, bookmarkFolder);
  expect.ok(bookmarkExists, "Bookmark was created in the bookmarks menu");

}

var type = function(aElement, aString) {
  for (var i = 0, len = aString.length; i < len; i++) { 
    aElement.keypress(aString[i]);
  }
}


