"use strict";

var wd = require('wd'),
    seleniumWebdriver = require('selenium-webdriver');
var  wdBridge;
try {
  wdBridge = require('wd-bridge')(seleniumWebdriver, wd);
} catch (ign) {
  // just so that it runs locally
  wdBridge = require('..')(seleniumWebdriver, wd);
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
