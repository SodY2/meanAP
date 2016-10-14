'use strict';

describe('News E2E Tests:', function () {
  describe('Test News page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/news');
      expect(element.all(by.repeater('news in news')).count()).toEqual(0);
    });
  });
});
