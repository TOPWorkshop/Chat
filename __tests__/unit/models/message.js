const { Message } = require('../../../app/models');

describe('Models -> Message', () => {
  describe('Associations', () => {
    test('it should have the "Room" association', () => {
      expect(Object.keys(Message.associations)).toEqual(['Room']);
    });
  });
});
