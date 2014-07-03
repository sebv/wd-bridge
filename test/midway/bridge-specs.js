"use strict";
/* global describe, it */
var wd = require('wd'),
    wdBridge = require('../..')(wd),
    seleniumWebdriver = require('selenium-webdriver'),
    chai = require('chai');
require('colors');
chai.should();

var sauceUsername = process.env.SAUCE_USERNAME;
var sauceAccessKey = process.env.SAUCE_ACCESS_KEY;
delete process.env.SAUCE_USERNAME;
delete process.env.SAUCE_ACCESS_KEY;


describe('bridge', function () {
  this.timeout(60000);   
  describe('selenium webdriverjs', function () {

    if(!process.env.SAUCE) { 
      it('should work with default setting', function () {
        var builder = new seleniumWebdriver.Builder();
        var driver = builder.build();
        driver.get('http://docs.seleniumhq.org/');
        return driver.getTitle().then(function (title) {
          // making sure it is working
          title.should.equal('Selenium - Web Browser Automation');
        })
        .then(function () {
          return wdBridge.initFromSeleniumWebdriver(builder, driver);
        })
        .then(function (wdDriver) {
          wdDriver.on('status', function (info) {
            console.log(info.cyan);
          });
          wdDriver.on('command', function (eventType, command, response) {
            console.log(' > ' + eventType.cyan, command, (response || '').grey);
          });
          wdDriver.on('http', function (meth, path, data) {
            console.log(' > ' + meth.magenta, path, (data || '').grey);
          });
          return wdDriver.title();
        }).then(function (title) {
          title.should.equal('Selenium - Web Browser Automation');
        })
        .then(function () {
          driver.quit();
        });
      });

      it('should work in more complicate cases', function () {
        var builder = new seleniumWebdriver.Builder()
          .usingServer('http://localhost:4444/wd/hub')
          .withCapabilities(seleniumWebdriver.Capabilities.chrome());
        var driver = builder.build();
        driver.get('http://docs.seleniumhq.org/');
        return driver.getTitle().then(function (title) {
          // making sure it is working
          title.should.equal('Selenium - Web Browser Automation');
        }).then(function () {
          return wdBridge.initFromSeleniumWebdriver(builder, driver);
        }).then(function (wdDriver) {
          wdDriver.on('status', function (info) {
            console.log(info.cyan);
          });
          wdDriver.on('command', function (eventType, command, response) {
            console.log(' > ' + eventType.cyan, command, (response || '').grey);
          });
          wdDriver.on('http', function (meth, path, data) {
            console.log(' > ' + meth.magenta, path, (data || '').grey);
          });
          return wdDriver.title();
        }).then(function (title) {
          title.should.equal('Selenium - Web Browser Automation');
        }).then(function () {
          driver.quit();
        });
      });
    }
    if (process.env.SAUCE) {
      var wdDriver;
      it('should work with sauce', function () {
        var builder = new seleniumWebdriver.Builder()
          .usingServer('http://ondemand.saucelabs.com:80/wd/hub')
          .withCapabilities({
            browserName: 'Chrome',
            name: 'wd-bridge SeleniumWebdriver test',
            username: sauceUsername,
            accessKey: sauceAccessKey
          });
        var driver = builder.build();
        driver.get('http://docs.seleniumhq.org/');
        return driver.getTitle().then(function (title) {
          // making sure it is working
          title.should.equal('Selenium - Web Browser Automation');
        }).then(function () {
          return wdBridge.initFromSeleniumWebdriver(builder, driver);
        }).then(function (_wdDriver) {
          wdDriver = _wdDriver;
          wdDriver.on('status', function (info) {
            console.log(info.cyan);
          });
          wdDriver.on('command', function (eventType, command, response) {
            console.log(' > ' + eventType.cyan, command, (response || '').grey);
          });
          wdDriver.on('http', function (meth, path, data) {
            console.log(' > ' + meth.magenta, path, (data || '').grey);
          });
          return wdDriver.title();
        }).then(function (title) {
          title.should.equal('Selenium - Web Browser Automation');
        }).then(function () {
          return driver.quit();
        }).then(function () {
          return wdDriver.sauceJobStatus(true);
        });
      });
    }

  });
});