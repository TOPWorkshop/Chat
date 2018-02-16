const { Room } = require('../../../app/models');

describe('Models -> Room', () => {
  describe('Associations', () => {
    test('it should have the "Message" association', () => {
      expect(Object.keys(Room.associations)).toEqual(['Messages']);
    });
  });
});
