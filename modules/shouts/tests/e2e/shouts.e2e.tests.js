'use strict';

describe('Shouts E2E Tests:', function () {
  describe('Test Shouts page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/shouts');
      expect(element.all(by.repeater('shout in shouts')).count()).toEqual(0);
    });
  });
});
