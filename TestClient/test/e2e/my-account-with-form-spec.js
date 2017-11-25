const expect = require('chai').expect;
const { MyAccount } = require('./page-objects/');
const myAccountObject = new MyAccount();

describe('Страница /myaccount', () => {
  beforeEach(() => {
    myAccountObject.getPage();
  });

  describe('На странице находится форма', () => {
    it(`Форма с именем ${myAccountObject.pageFormName} присутствует`, () => {
      expect(myAccountObject.isFromExist()).to.eventually.is.true;
    });
  });

  describe('Обязательные поля формы', () => {
    // Название шаблонов поиска нужных полей ввода
    const fieldsPatternsNames = myAccountObject.fieldNamesPatternsCalled;

    describe('Ввод корректных данных валиден', () => {
      Object.keys(myAccountObject.validData).forEach(validDataFieldName => {
        const currentFieldValidData = myAccountObject.validData[validDataFieldName];
        const currentFieldPatternName = fieldsPatternsNames[validDataFieldName];
        let currentInputField = myAccountObject[currentFieldPatternName];

        it(`Ввод валидных данных в поле ${validDataFieldName}`, () => {
          const checkStatus = myAccountObject.setValueAndCheckFieldValid(currentInputField, currentFieldValidData);
          return expect(checkStatus).to.eventually.is.true;
        });
      })
    });

    describe('Ввод невалидных данных', () => {
      Object.keys(myAccountObject.inValidData).forEach(inValidDataFieldName => {
        describe(`Ввод невалидных данных в поле ${inValidDataFieldName}`, () => {
          const currentFieldInValidData = myAccountObject.inValidData[inValidDataFieldName];
          const currentFieldPatternName = fieldsPatternsNames[inValidDataFieldName];
          let currentInputField;

          beforeEach(() => {
            currentInputField = myAccountObject[currentFieldPatternName];
          });

          currentFieldInValidData.forEach(inValidData => {
            it(inValidData.description, () => {
              const checkStatus = myAccountObject.setValueAndCheckFieldValid(currentInputField, inValidData.data);
              return expect(checkStatus).to.eventually.is.false;
            });
          });
        });
      });
    });

  });
});