'use strict';

describe('Naps E2E Tests:', function () {
  describe('Test Naps page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/naps');
      expect(element.all(by.repeater('nap in naps')).count()).toEqual(0);
    });
  });
});
