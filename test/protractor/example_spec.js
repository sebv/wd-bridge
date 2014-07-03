/* global describe, it, browser, wdBrowser, element , by, expect, beforeEach */
"use strict";

describe('angularjs homepage', function () {
  beforeEach(function () {
    browser.get('http://www.angularjs.org');
  });

  it('should retrieve the title using browser', function () {
    return browser.getTitle().then(function (title) {
      expect(title).toEqual('AngularJS — Superheroic JavaScript MVW Framework');
    });
  });

  it('should retrieve the title using wdBrowser', function (done) {
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

  if (process.env.SAUCE) {
    it('should update the job status', function (done) {
      wdBrowser.sauceJobStatus(true).nodeify(done);
    });
  }
});
