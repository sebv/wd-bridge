"use strict";

var wd = require('wd'),
    protractor = require('protractor');
var  wdBridge;
try {
  wdBridge = require('wd-bridge')(protractor, wd);
} catch (ign) {
  // just so that it runs locally
  wdBridge = require('../..')(wd);
}

var sauceUsername = process.env.SAUCE_USERNAME;
var sauceAccessKey = process.env.SAUCE_ACCESS_KEY;
delete process.env.SAUCE_USERNAME;
delete process.env.SAUCE_ACCESS_KEY;

// An example configuration file.
var config = exports.config = {
  sauceUser: sauceUsername,
  sauceKey: sauceAccessKey,

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'chrome',
    'name': 'protractor test'
  },

  // Spec patterns are relative to the current working directly when
  // protractor is called.
  specs: ['example_spec.js'],

  // Options to be passed to Jasmine-node.
  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  },

  // configuring wd in onPrepare
  onPrepare: function () {
    process.env.SAUCE = 1;
    wdBridge.initFromProtractor(config);
  }

};
