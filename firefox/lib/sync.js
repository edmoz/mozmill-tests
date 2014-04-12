/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

Cu.import("resource://gre/modules/Services.jsm");

const SIGNUP_LINK = "about:accounts?action=signup";
const SIGNIN_LINK = "about:accounts?action=signin";
const MANAGE_ACCOUNT = "https://accounts.firefox.com/settings";
const DELETE_ACCOUNT = "https://accounts.firefox.com/delete_account";

/**
 * Open about:accounts?action=signup
 *
 * @param {MozMillController} controller
 *        MozMillController of the window to operate on
 */
function navigateToSignup(controller) {
  controller.open(SIGNUP_LINK);
  controller.waitForPageLoad();
}

/**
 * Open about:accounts?action=signin
 *
 * @param {MozMillController} controller
 *        MozMillController of the window to operate on
 */
function navigateToSignin(controller) {
  controller.open(SIGNIN_LINK);
  controller.waitForPageLoad();
}

/**
  * Open accounts.firefox.com/settings
  *
  * @param {MozMillController} controller
  *        MozMillController of the window to operate on
  */
function navigateToManageAccount(controller) {
  controller.open(MANAGE_ACCOUNT);
  controller.waitForPageLoad();
}

/**
 * Open accounts.firefox.com/settings
 *
 * @param {MozMillController} controller
 *        MozMillController of the window to operate on
 */
function navigateToDeleteAccount(controller) {
  controller.open(DELETE_ACCOUNT);
  controller.waitForPageLoad();
}

/**
 * Constructor
 *
 * @param {MozMillController} controller
 *        MozMill controller of the window to operate on
 */
function DeleteAccountSite(controller) {
  this._controller = controller;
  this._deleteAccountButton = findElement.XPath(controller.window.content.document, "/html/body/div[2]/div/section/form/div[2]/button");
  this._passwordField = findElement.ID(controller.window.content.document, "password");
}

/**
 * Delete Account site class
 */
DeleteAccountSite.prototype = {
  /**
   * Returns the MozMill controller
   *
   * @returns Mozmill controller
   * @type {MozMillController}
   */
  get controller() {
    return this._controller;
  },

  /**
   * Get delete account button
   *
   * @returns delete account button
   * @type {MozMillElement}
   */
  get deleteAccountButton() {
    return this._deleteAccountButton;
  },

  /**
   * Get password field
   *
   * @returns password field
   * @type {MozMillElement}
   */
  get passwordField() {
    return this._passwordField;
  },

  /**
   * Fill password field
   *
   * @param {string}
   *        text to type in field
   */
  typePassword : function SignUpSite_typePassword(string) {
    var passwordField = this.passwordField
    passwordField.waitThenClick();
    type(passwordField, string);
  },
}

/**
 * Constructor
 *
 * @param {MozMillController} controller
 *        MozMill controller of the window to operate on
 */
function ManageAccountSite(controller) {
  this._controller = controller;
  this._signOutField = findElement.ID(controller.window.content.document, "signout");
  this._changePasswordField = findElement.ID(controller.window.content.document, "change-password");
  this._deleteAccountField = findElement.ID(controller.window.content.document, "delete-account");
}

/**
 * Manage Account site class
 */
ManageAccountSite.prototype = {
  /**
   * Returns the MozMill controller
   *
   * @returns Mozmill controller
   * @type {MozMillController}
   */
  get controller() {
    return this._controller;
  },


  /**
   * Get sign out field
   *
   * @returns sign out field
   * @type {MozMillElement}
   */
  get signOutField() {
    return this._signOutField;
  },

  /**
   * Get change password field
   *
   * @returns change password field
   * @type {MozMillElement}
   */
  get changePasswordField() {
    return this._changePasswordField;
  },

  /**
   * Get delete account field
   *
   * @returns delete account field
   * @type {MozMillElement}
   */
  get deleteAccountField() {
    return this._deleteAccountField;
  },
}

/**
 * Constructor
 *
 * @param {MozMillController} controller
 *        MozMill controller of the window to operate on
 */
function SignUpSite(controller) {
  this._controller = controller;
  this._emailField = findElement.XPath(controller.tabs.activeTab, "descendant-or-self::input[contains(concat(' ', normalize-space(@class), ' '), ' email ')]");
  this._passwordField = findElement.ID(controller.window.content.document, "password");
  this._nextButton = findElement.XPath(controller.tabs.activeTab, "descendant-or-self::button");
}

/**
 * SignUp site class
 */
SignUpSite.prototype = {
  /**
   * Returns the MozMill controller
   *
   * @returns Mozmill controller
   * @type {MozMillController}
   */
  get controller() {
    return this._controller;
  },

  /**
   * Get e-mail field
   *
   * @returns e-mail field
   * @type {MozMillElement}
   */
  get emailField() {
    return this._emailField;
  },

  /**
   * Get password field
   *
   * @returns password field
   * @type {MozMillElement}
   */
  get passwordField() {
    return this._passwordField;
  },

  /**
   * Get e-mail field
   *
   * @returns e-mail field
   * @type {MozMillElement}
   */
  get nextButton() {
    return this._nextButton;
  },

  /**
   * Fill e-mail field
   *
   * @param {string}
   *        text to type in field
   */
  typeEmail : function SignUpSite_typeEmail(string) {
    var email = this.emailField;
    email.waitThenClick();
    type(email, string);
  },

  /**
   * Fill password field
   *
   * @param {string}
   *        text to type in field
   */
  typePassword : function SignUpSite_typePassword(string) {
    var password = this.passwordField;
    password.waitThenClick();
    type(password, string);
  },


  /**
   * Select age
   *
   * @param {number}
   *        Index in combobox
   */
  selectAge : function SignUpSite_selectAge(index) {
    var age = findElement.ID(this.controller.window.content.document, "fxa-age-year");//this.ageDropBox;
    age.select(index);
  },

  /**
   * Click on next button
   */
  clickNextButton : function SignUpSite_clickNextButton(string) {
    var button= this.nextButton;
    button.click();
  },

};

var type = function(aElement, aString) {
  for (var i = 0, len = aString.length; i < len; i++) {
    aElement.keypress(aString[i]);
  }
}

// Export of functions
exports.navigateToSignin = navigateToSignin;
exports.navigateToSignup = navigateToSignup;
exports.navigateToDeleteAccount = navigateToDeleteAccount;

// Export of classes
exports.SignUpSite = SignUpSite;
exports.DeleteAccountSite = DeleteAccountSite;
