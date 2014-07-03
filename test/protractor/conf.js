"use strict";

var wd = require('wd'),
    protractor = require('protractor');
var  wdBridge;
try {
  wdBridge = require('wd-bridge')(protractor, wd);
} catch (ign) {
  // just so that it runs locally
  wdBridge = require('../..')(protractor, wd);
}

// An example configuration file.
var config = exports.config = {
  // The address of a running selenium server.
  seleniumAddress: 'http://localhost:4444/wd/hub',

  // Capabilities to be passed to the webdriver instance.
  capabilities: {
    'browserName': 'chrome'
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
    wdBridge.initFromProtractor(config);
  }

};
