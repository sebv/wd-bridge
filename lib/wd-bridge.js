"use strict";

var UrlLib = require('url');

module.exports  =  function (wd) {
  var Q = wd.Q;
  return {
    initFromSeleniumWebdriver: function (builder, driver) {
      var deferred = Q.defer();
      var url = UrlLib.parse(builder.getServerUrl() || 
        'http://localhost:4444/wd/hub');
      var caps = builder.getCapabilities();
      if (caps && caps.get('username') && caps.get('accessKey')) {
        url.auth = caps.get('username') + ':' + caps.get('accessKey');
      }
      var wdDriver = wd.promiseChainRemote(url);
      driver.getSession().then(function (session) {
        wdDriver.attach(session.getId());
        deferred.resolve(wdDriver);
      });
      return deferred.promise;
    },
    initFromProtractor: function (config) {
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
      browser.driver.getSession().then(function (session) {
        wdBrowser.attach(session.getId());
      });
    }
  };
};
