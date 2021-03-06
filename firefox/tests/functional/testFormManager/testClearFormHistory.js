/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// Include required modules
var { assert, expect } = require("../../../../lib/assertions");
var modalDialog = require("../../../lib/modal-dialog");

const BASE_URL = collector.addHttpResource("../../../../data/");
const TEST_DATA = BASE_URL + "form_manager/form.html";

const FNAME = "John";
const LNAME = "Smith";

function setupModule(aModule) {
  aModule.controller = mozmill.getBrowserController();

  // Clear complete form history so we don't interfere with already added entries
  try {
    var formHistory = Cc["@mozilla.org/satchel/form-history;1"].
                      getService(Ci.nsIFormHistory2);
    formHistory.removeAllEntries();
  }
  catch (ex) {}
}

/**
 * Verify clearing form and search history
 */
function testClearFormHistory() {
  // Go to the sample page and submit form data
  controller.open(TEST_DATA);
  controller.waitForPageLoad();

  var firstName = new elementslib.ID(controller.tabs.activeTab, "ship_fname");
  var lastName = new elementslib.ID(controller.tabs.activeTab, "ship_lname");
  var submitButton = new elementslib.ID(controller.tabs.activeTab, "SubmitButton");

  controller.type(firstName, FNAME);
  controller.type(lastName, LNAME);

  controller.click(submitButton);
  controller.waitForPageLoad();

  // Call clear recent history dialog and clear all form history
  var md = new modalDialog.modalDialog(controller.window);
  md.start(clearHistoryHandler);

  controller.mainMenu.click("#sanitizeItem");
  md.waitForDialog();

  // Verify forms are cleared
  var popDownAutoCompList = new elementslib.ID(controller.window.document, "PopupAutoComplete");

  controller.open(TEST_DATA);
  controller.waitForPageLoad();

  // Begin typing into the name fields
  controller.waitForElement(firstName);
  controller.type(firstName, FNAME.substring(0,2));
  controller.sleep(500);
  expect.ok(!popDownAutoCompList.getNode().popupOpen, "Auto-complete popup is not visible");

  controller.type(lastName, LNAME.substring(0,2));
  controller.sleep(500);
  expect.ok(!popDownAutoCompList.getNode().popupOpen, "Auto-complete popup is not visible");
}

/**
 * Accesses the clear recent history dialog and accepts the default options to clear
 */
function clearHistoryHandler(controller) {
  // Verify the checkbox to clear form data is checked
  var checkBox = new elementslib.XPath(controller.window.document,
                                       "/*[name()='prefwindow']" +
                                       "/*[name()='prefpane'][1]" +
                                       "/*[name()='listbox'][1]" +
                                       "/*[name()='listitem'][2]");
  controller.waitForElement(checkBox);
  assert.ok(checkBox.getNode().checked, "The checkbox to clear form data is checked");

  var clearButton = new elementslib.Lookup(controller.window.document,
                                           '/id("SanitizeDialog")' +
                                           '/anon({"anonid":"dlg-buttons"})' +
                                           '/{"dlgtype":"accept"}');
  controller.waitThenClick(clearButton);
}
