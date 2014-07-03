"use strict";

var wd = require('wd'),
    seleniumWebdriver = require('selenium-webdriver');
var  wdBridge;
try {
  wdBridge = require('wd-bridge')(wd);
} catch (ign) {
  // just so that it runs locally
  wdBridge = require('..')(wd);
}

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
  }).then(function () { return driver.quit(); })
  .done();
