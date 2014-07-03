"use strict";

var UrlLib = require('url');

module.exports  =  function (externalLib, wd) {
  var Q = wd.Q;
  // dummy method so that it get chained
  wd.addPromiseChainMethod('wdEl', function () {
    throw new Error('Not implemented'); });
  wd.addPromiseChainMethod('swEl', function () {
    throw new Error('Not implemented'); });
  return {
    initFromSeleniumWebdriver: function (builder, driver) {
      var seleniumWebdriver = externalLib;
      var deferred = Q.defer();
      var url = UrlLib.parse(builder.getServerUrl() ||
        'http://localhost:4444/wd/hub');
      var caps = builder.getCapabilities();
      if (caps && caps.get('username') && caps.get('accessKey')) {
        url.auth = caps.get('username') + ':' + caps.get('accessKey');
      }
      var wdDriver = wd.promiseChainRemote(url);
      wdDriver.wdEl = function (el) {
        // converting from selenium-webdriver to wd
        return wdDriver.chain()
          .then(function () {
            return el.toWireValue().then(function (wireValue) {
              return wdDriver.newElement(wireValue.ELEMENT);
            });
          });
      };
      wdDriver.swEl = function (el) {
        // converting from selenium-webdriver to wd
        return new seleniumWebdriver.WebElement(driver, {ELEMENT: el.value});
      };
      driver.getSession().then(function (session) {
        wdDriver.attach(session.getId());
        deferred.resolve(wdDriver);
      });
      return deferred.promise;
    },
    initFromProtractor: function (config) {
      var protractor = externalLib;
      /* global browser */
      var url;
      if (config.sauceUser && config.sauceKey) {
        url = UrlLib.parse(config.seleniumAddress ||
          'http://ondemand.saucelabs.com:80/wd/hub');
        url.auth = config.sauceUser + ':' + config.sauceKey;
      } else {
        url = UrlLib.parse(config.seleniumAddress);
      }
      var wdBrowser = global.wdBrowser = wd.promiseChainRemote(url);
      wdBrowser.wdEl = function (el) {
        // converting from selenium-webdriver to wd
        return wdBrowser.chain()
          .then(function () {
            return el.toWireValue().then(function (wireValue) {
              return wdBrowser.newElement(wireValue.ELEMENT);
            });
          });
      };
      wdBrowser.swEl = function (el) {
        // converting from selenium-webdriver to wd
        return new protractor.WebElement(browser, {ELEMENT: el.value});
      };
      browser.driver.getSession().then(function (session) {
        wdBrowser.attach(session.getId());
      });
    }
  };
};
