const models = require('../../../app/models');

const expectedModelFields = {
  Message: [
    'id',
    'text',
    'createdAt',
    'updatedAt',
    'RoomId',
  ],
  Room: [
    'id',
    'name',
    'password',
    'salt',
    'createdAt',
    'updatedAt',
  ],
};

describe('Models', () => {
  test('there should be the sequelize objects', () => {
    expect(models).toHaveProperty('Sequelize');

    expect(models).toHaveProperty('sequelize');
    expect(models.sequelize).toBeInstanceOf(models.Sequelize);
  });

  Object.keys(expectedModelFields).forEach((modelName) => {
    const modelFields = expectedModelFields[modelName];
    const Model = models[modelName];

    test(`Model "${modelName}" should have the right fields`, () => {
      expect(Object.keys(Model.attributes)).toMatchObject(modelFields);
    });
  });
});
