/* global describe, it, browser, wdBrowser, expect, beforeEach */
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

  if (process.env.SAUCE) {
    it('should update the job status', function (done) {
      wdBrowser.sauceJobStatus(true).nodeify(done);
    });
  }
});
