module.exports = class TopMenu {
  constructor() {
    this.selectedMenuItemClass = '.btn-primary';
    this.menuItemsUrls = [
      '/#!/list',
      '/#!/new',
      '/#!/myaccount'
    ];
  }

  getPage(pageName = '/') {
    browser.get(pageName);
  }

  async isSelectedMenuItemExist() {
    try {
      return await browser.isElementPresent(by.css(this.selectedMenuItemClass));

    } catch (error) {
      return error;
    }
  }

  async getSelectedMenuItem() {
    try {
      const selectedItemExist = await this.isSelectedMenuItemExist();
      return selectedItemExist ? await element(by.css(this.selectedMenuItemClass)) : null;

    } catch (error) {
      return error;
    }
  }

  async getSelectedMenuItemHref() {
    try {
      const selectedMenuItem = await this.getSelectedMenuItem();
      return selectedMenuItem ? selectedMenuItem.getAttribute('href') : null;

    } catch (error) {
      return error;
    }
  }
};