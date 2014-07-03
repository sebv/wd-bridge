#wd-bridge

[![NPM version](https://badge.fury.io/js/wd-bridge.png)](https://npmjs.org/package/wd-bridge)
[![Dependency Status](https://david-dm.org/sebv/wd-bridge.svg)](https://david-dm.org/sebv/wd-bridge)
[![devDependency Status](https://david-dm.org/sebv/wd-bridge/dev-status.svg)](https://david-dm.org/sebv/wd-bridge#info=devDependencies)

bridge between the wd driver and other selenium clients

#install

`npm install wd-bridge`

#usage

##Selenium WebdriverJs

```js
var wd = require('wd'),
    wdBridge = require('wd-bridge')(wd),
    seleniumWebdriver = require('selenium-webdriver');

var builder = new seleniumWebdriver.Builder()
  .usingServer('http://localhost:4444/wd/hub')
  .withCapabilities(seleniumWebdriver.Capabilities.chrome());
var driver = builder.build();
var wdDriver;
wdBridge
  .initFromSeleniumWebdriver(builder, driver)
  .then(function (_wdDriver) { wdDriver = _wdDriver; })
  .then(function () {
    return driver.get('http://docs.seleniumhq.org/');
  }).then(function () { return driver.getTitle(); })
  .then(function (title) {
    console.log('title from driver -->', title);
  }).then(function () { return wdDriver.title(); })
  .then(function (title) {
    console.log('title from wdDriver -->', title);
  }).then(function () {
    // converting to wd element
    return driver.findElement(seleniumWebdriver.By.id('mainContent'))
      .then(function (el) {
        return wdDriver.wdEl(el).text();
      })
      .then(function (text) {
        console.log('text after converting to wd element -->',
          text.substring(0, 50));
      });
  }).then(function () {
    // converting from wd element
    return wdDriver.elementById('mainContent')
      .then(function (el) {
        return wdDriver.swEl(el).getText();
      }).then(function (text) {
        console.log('text after converting from wd element -->',
          text.substring(0, 50));
      });
  }).then(function () { return driver.quit(); })
  .done();
```

##Protractor

config:

```js
"use strict";

var wd = require('wd'),
    wdBridge = require('wd-bridge')(wd);

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
```

specs (use the global wdBrowser variable):

```
describe('angularjs homepage', function () {
  beforeEach(function () {
    browser.get('http://www.angularjs.org');
  });

  // regular protractor tests

  it('should be able to use wdBrowser ', function (done) {
    wdBrowser.title().then(function (title) {
      expect(title).toEqual('AngularJS — Superheroic JavaScript MVW Framework');
    }).nodeify(done);
  });

  it('should convert to wd element', function (done) {
    var el = element.all(by.repeater('todo in todos')).get(1);
    wdBrowser.wdEl(el).text().then(function (text) {
      expect(text).toEqual('build an angular app');
    }).nodeify(done);
  });

  it('should convert from wd element', function (done) {
    return wdBrowser
      .elementById('add-some-control')
      .then(function (el) {
        return wdBrowser.swEl(el).getText().then(function (text) {
          expect(text).toEqual('Add Some Control');
        });
      }).nodeify(done);
  });
});
```
