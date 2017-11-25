const expect = require('chai').expect;
const { TopMenu } = require('./page-objects/');
const topMenuObject = new TopMenu();

describe('Проверка подсветки пунктов меню', () => {
  it('На главной странице нет подсветки', () => {
    topMenuObject.getPage();
    expect(topMenuObject.getSelectedMenuItem()).to.eventually.is.null;
  });

  topMenuObject.menuItemsUrls.forEach(testedUrl => {

    it(`Подсветка на странице: ${testedUrl}`, () => {
      topMenuObject.getPage(testedUrl);

      return Promise.all([
        browser.getCurrentUrl(),
        topMenuObject.getSelectedMenuItemHref()
      ])
        .then(([currentUrl, currentMenuItemHref]) => {
          expect(currentUrl).is.equal(currentMenuItemHref);
        })
        .catch(error => {
          console.log(`Тест страницы: ${testedUrl} с ошибкой!`);
          throw error;
        });
    });

  });
});