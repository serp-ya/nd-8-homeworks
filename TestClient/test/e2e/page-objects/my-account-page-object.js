module.exports = class MyAccount {
  constructor() {
    this.url = '/#!/myaccount';
    this.pageFormName = 'vm.loginForm';
    this.validFieldClass = 'ng-valid';
    this.fieldNamesPatternsCalled = {
      name: 'inputNameField',
      email: 'inputEmailField',
      phone: 'inputPhoneField'
    };

    this.validData = {
      name: 'Name min length - 3 symb',
      email: 'looks.like@valid.email',
      phone: '+11111111111'
    };

    this.inValidData = {
      name: [
        {
          data: '',
          description: 'Ввод меньше 3 символов не валиден'
        },
        {
          data: '         ',
          description: 'Поле не валидно, если заполнить пробелами'
        }
      ],

      email: [
        {
          data: 'strange.pseudo.email',
          description: 'Ввод строки без @ не валиден'
        },
        {
          data: 'strange.pseudo.email@mailru',
          description: 'Ввод строки c @ но без .domain-zone не валидна'
        },
        {
          data: '@mailru',
          description: 'Ввод строки c без текста перед @ не валиден'
        },
        {
          data: 'a@b.c',
          description: 'Попытка имитировать email не валидна'
        }
      ],

      phone: [
        {
          data: '+1234567890',
          description: 'Ввод меньше 12 знако не валиден'
        },
        {
          data: '1234567891011',
          description: 'Ввод без знака "+" в начале не валиден'
        },
        {
          data: '+7925234234з',
          description: 'Наличие буквы в поле ввода - не валидно'
        },
        {
          data: '+79252!$42345',
          description: 'Наличие знаков в строке не валидно'
        }
      ],
    };
  }

  getPage() {
    browser.get(this.url);
  }

  get inputNameField() {
    return element(by.model('vm.inputData.name'));
  }

  get inputEmailField() {
    return element(by.model('vm.inputData.email'));
  }

  get inputPhoneField() {
    return element(by.model('vm.inputData.phone'));
  }

  async setValueAndCheckFieldValid(field, value) {
    try {
      await field.sendKeys(value);
      const filledFieldClasses = await field.getAttribute('class');

      return filledFieldClasses.split(' ').some(className => className === this.validFieldClass);

    } catch (error) {
      return error;
    }
  }

  async isFromExist() {
    try {
      return await browser.isElementPresent(by.css(`[name="${this.pageFormName}"]`));

    } catch (error) {
      return error;
    }
  }
};